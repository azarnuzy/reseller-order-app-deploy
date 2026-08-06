import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";
import { after, test } from "node:test";
import { HttpError } from "../http-error";
import { addDraftItem, getOrderSummary, saveCustomerData } from "../modules/drafts/service";
import { confirmOrder, getOrder } from "../modules/orders/service";
import { checkProductAvailability, searchProducts } from "../modules/products/service";
import { prisma } from "../prisma";

after(async () => {
  await prisma.$disconnect();
});

test("catalog, draft totals, MOQ, and stock use the existing services", async () => {
  const testId = randomUUID();
  const userId = `verification-user-${testId}`;

  try {
    await createUserAndSession(userId, `verification-session-${testId}`);
    const catalog = await searchProducts({ limit: 5, orderable: true, sort: "TITLE_ASC" });
    assert.ok(catalog.products.length > 0);

    const product = await prisma.product.findFirst({
      where: { isOrderable: true, stock: { gt: 0 } },
      orderBy: [{ minimumOrderQuantity: "desc" }, { id: "asc" }],
    });
    assert.ok(product);

    const sessionId = `verification-session-${testId}`;
    const draft = await addDraftItem(sessionId, userId, {
      productId: product.id,
      quantity: product.minimumOrderQuantity,
    });
    const expectedSubtotal = Number(product.price) * product.minimumOrderQuantity;
    const expectedDiscount = (expectedSubtotal * Number(product.discountPercentage)) / 100;
    assert.equal(draft.totals.subtotal, roundMoney(expectedSubtotal));
    assert.equal(draft.totals.discountTotal, roundMoney(expectedDiscount));
    assert.equal(draft.totals.total, roundMoney(expectedSubtotal - expectedDiscount));

    const unavailable = await checkProductAvailability(product.id, product.stock + 1);
    assert.equal(unavailable.canFulfill, false);
    assert.equal(unavailable.status, "INSUFFICIENT_STOCK");

    if (product.minimumOrderQuantity > 1) {
      await assert.rejects(
        addDraftItem(sessionId, userId, {
          productId: product.id,
          quantity: product.minimumOrderQuantity - 1,
        }),
        isHttpError("MINIMUM_ORDER_NOT_MET"),
      );
    }
  } finally {
    await cleanupUsers([userId]);
  }
});

test("confirmation is idempotent and a different session cannot read the order", async () => {
  const testId = randomUUID();
  const ownerUserId = `verification-owner-${testId}`;
  const foreignUserId = `verification-foreign-${testId}`;
  const ownerSessionId = `verification-owner-session-${testId}`;
  const foreignSessionId = `verification-foreign-session-${testId}`;
  const product = await prisma.product.findFirst({
    where: { isOrderable: true, stock: { gt: 0 } },
    orderBy: [{ stock: "desc" }, { id: "asc" }],
  });
  assert.ok(product);
  const originalProductState = { isOrderable: product.isOrderable, stock: product.stock };

  try {
    await createUserAndSession(ownerUserId, ownerSessionId);
    await createUserAndSession(foreignUserId, foreignSessionId);
    await addDraftItem(ownerSessionId, ownerUserId, {
      productId: product.id,
      quantity: product.minimumOrderQuantity,
    });
    await saveCustomerData(ownerSessionId, ownerUserId, {
      address: "123 Verification Street, Jakarta",
      name: "Verification Customer",
      whatsapp: "+628000000099",
    });
    const summary = await getOrderSummary(ownerSessionId, ownerUserId);

    const firstConfirmation = await confirmOrder(ownerSessionId, ownerUserId, summary.draftVersion);
    const repeatedConfirmation = await confirmOrder(
      ownerSessionId,
      ownerUserId,
      summary.draftVersion,
    );

    assert.equal(firstConfirmation.idempotent, false);
    assert.equal(repeatedConfirmation.idempotent, true);
    assert.equal(repeatedConfirmation.order.id, firstConfirmation.order.id);
    await assert.rejects(
      getOrder(foreignSessionId, foreignUserId, firstConfirmation.order.orderNumber),
      isHttpError("ORDER_NOT_FOUND"),
    );
  } finally {
    await prisma.order.deleteMany({ where: { userId: ownerUserId } });
    await cleanupUsers([ownerUserId, foreignUserId]);
    await prisma.product.update({
      where: { id: product.id },
      data: originalProductState,
    });
  }
});

async function createUserAndSession(userId: string, sessionId: string) {
  await prisma.user.create({
    data: {
      email: `${userId}@reseller.invalid`,
      id: userId,
      name: "Verification User",
      chatSessions: { create: { id: sessionId } },
    },
  });
}

async function cleanupUsers(userIds: string[]) {
  await prisma.customer.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
}

function isHttpError(code: string) {
  return (error: unknown) => error instanceof HttpError && error.code === code;
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
