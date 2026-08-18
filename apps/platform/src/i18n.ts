import { createFrontendI18n, type Resource } from "@repo/i18n";

const resources = {
  en: {
    common: {
      language: {
        label: "Language",
        options: {
          en: "English",
          id: "Bahasa Indonesia",
        },
      },
      theme: {
        label: "Theme",
        options: {
          dark: "Dark",
          light: "Light",
          system: "System",
        },
      },
      nav: {
        brand: "Reseller Order",
        orderChat: "Order chat",
        privacy: "Privacy",
        profile: "Edit profile",
      },
      sidebar: {
        workspace: "Workspace",
      },
      home: {
        description:
          "The ordering conversation will be connected after the agent workflow is ready.",
        eyebrow: "Workspace ready",
        title: "Order through a conversation",
      },
      profile: {
        description: "Update the display details for the shared guest profile.",
        eyebrow: "Profile settings",
        form: {
          cancel: "Cancel",
          description: "Name is required. Avatar image is optional and must be a public URL.",
          fallbackError: "Failed to save profile.",
          image: "Avatar URL",
          imageDescription: "Leave empty to remove the avatar image.",
          imageInvalid: "Enter a valid http or https image URL.",
          name: "Display name",
          nameDescription: "Use the name people should recognize in the product.",
          nameRequired: "Display name is required.",
          nameTooLong: "Display name must be 100 characters or fewer.",
          save: "Save profile",
          saved: "Profile saved.",
          saving: "Saving...",
          title: "Edit profile",
        },
        preview: {
          description: "A quick check before saving your changes.",
          title: "Preview",
        },
        title: "Edit profile",
      },
      privacy: {
        back: "Back to order chat",
        description:
          "This policy explains how Reseller Order handles information when you use the website or chat with the ordering assistant on WhatsApp.",
        effectiveDate: "Effective August 18, 2026",
        eyebrow: "Your information",
        sections: {
          ai: {
            body: "The ordering assistant uses an AI model to understand requests and prepare responses. Messages may be sent to our AI service provider for processing. The assistant can make mistakes, so prices, stock, quantities, and order totals are verified by the application before an order is finalized. Do not send passwords, payment-card numbers, government identification numbers, or other unnecessary sensitive information.",
            title: "Automated assistant and AI processing",
          },
          choices: {
            body: "You may ask questions about this policy or request access, correction, or deletion of information associated with your WhatsApp conversation. Use the support contact shown in the Reseller Order WhatsApp business profile and clearly state that your message is a privacy request. We may ask you to verify control of the relevant WhatsApp account. Some information may be retained where required for security, dispute resolution, accounting, or legal compliance.",
            title: "Your choices and deletion requests",
          },
          collection: {
            body: "We process the messages and order details you provide, such as product selections, quantities, draft orders, and confirmed orders. For WhatsApp conversations, Meta provides sender and message identifiers. We use the sender identifier to deliver replies and store a protected pseudonymous identifier so the assistant can continue the correct conversation. We also record limited technical events needed to prevent duplicate webhook processing and operate the service.",
            title: "Information we process",
          },
          contact: {
            body: "For privacy questions or data requests, contact the operator through the support email or phone number displayed in the Reseller Order WhatsApp business profile. Please do not include passwords, payment-card details, or identity documents in your request.",
            title: "Contact",
          },
          retention: {
            body: "Conversation, draft, and order records are retained only for as long as reasonably needed to operate the service, maintain order history, protect the service, and meet applicable legal obligations. When information is no longer needed, it is deleted or de-identified using reasonable operational processes.",
            title: "Retention and security",
          },
          sharing: {
            body: "Information is processed by service providers that help operate the application, including Meta and WhatsApp for messaging, OpenAI for AI response generation, hosting and database providers, and Langfuse for redacted operational tracing. We do not sell personal information. We may disclose information when required by law or when reasonably necessary to protect users, the service, or others.",
            title: "Service providers and disclosure",
          },
          transfers: {
            body: "Our service providers may process information in countries other than your own. We use the safeguards and contractual measures offered by those providers where applicable. This service is intended for business ordering and is not intentionally directed to children.",
            title: "International processing and children",
          },
          updates: {
            body: "We may update this policy when the service or legal requirements change. The effective date above will be updated when material changes are published.",
            title: "Policy updates",
          },
          usage: {
            body: "We use information to answer product questions, maintain conversation context, create and update order drafts, submit orders you approve, provide customer support, prevent duplicate processing, protect the service, and diagnose operational problems.",
            title: "How we use information",
          },
        },
        summary:
          "Reseller Order uses your information to provide the ordering conversation you request. We limit its use to operating, securing, and improving that service.",
        title: "Privacy Policy",
      },
    },
  },
  id: {
    common: {
      language: {
        label: "Bahasa",
        options: {
          en: "English",
          id: "Bahasa Indonesia",
        },
      },
      theme: {
        label: "Tema",
        options: {
          dark: "Gelap",
          light: "Terang",
          system: "Sistem",
        },
      },
      nav: {
        brand: "Reseller Order",
        orderChat: "Chat pesanan",
        privacy: "Privasi",
        profile: "Edit profil",
      },
      sidebar: {
        workspace: "Workspace",
      },
      home: {
        description: "Percakapan pemesanan akan dihubungkan setelah alur agen siap.",
        eyebrow: "Workspace siap",
        title: "Pesan melalui percakapan",
      },
      profile: {
        description: "Perbarui detail tampilan untuk profil tamu bersama.",
        eyebrow: "Pengaturan profil",
        form: {
          cancel: "Batal",
          description: "Nama wajib diisi. Gambar avatar opsional dan harus berupa URL publik.",
          fallbackError: "Gagal menyimpan profil.",
          image: "URL avatar",
          imageDescription: "Kosongkan untuk menghapus gambar avatar.",
          imageInvalid: "Masukkan URL gambar http atau https yang valid.",
          name: "Nama tampilan",
          nameDescription: "Gunakan nama yang mudah dikenali di produk.",
          nameRequired: "Nama tampilan wajib diisi.",
          nameTooLong: "Nama tampilan maksimal 100 karakter.",
          save: "Simpan profil",
          saved: "Profil tersimpan.",
          saving: "Menyimpan...",
          title: "Edit profil",
        },
        preview: {
          description: "Periksa cepat sebelum menyimpan perubahan.",
          title: "Pratinjau",
        },
        title: "Edit profil",
      },
      privacy: {
        back: "Kembali ke chat pesanan",
        description:
          "Kebijakan ini menjelaskan cara Reseller Order menangani informasi saat Anda menggunakan situs web atau berbicara dengan asisten pemesanan melalui WhatsApp.",
        effectiveDate: "Berlaku mulai 18 Agustus 2026",
        eyebrow: "Informasi Anda",
        sections: {
          ai: {
            body: "Asisten pemesanan menggunakan model AI untuk memahami permintaan dan menyiapkan jawaban. Pesan dapat dikirim ke penyedia layanan AI kami untuk diproses. Asisten dapat melakukan kesalahan, sehingga harga, stok, jumlah, dan total pesanan diverifikasi oleh aplikasi sebelum pesanan diselesaikan. Jangan mengirim kata sandi, nomor kartu pembayaran, nomor identitas pemerintah, atau informasi sensitif lain yang tidak diperlukan.",
            title: "Asisten otomatis dan pemrosesan AI",
          },
          choices: {
            body: "Anda dapat mengajukan pertanyaan tentang kebijakan ini atau meminta akses, koreksi, maupun penghapusan informasi yang terkait dengan percakapan WhatsApp Anda. Gunakan kontak dukungan yang ditampilkan di profil bisnis WhatsApp Reseller Order dan jelaskan bahwa pesan Anda merupakan permintaan privasi. Kami mungkin meminta Anda memverifikasi kendali atas akun WhatsApp terkait. Sebagian informasi dapat disimpan jika diperlukan untuk keamanan, penyelesaian sengketa, pembukuan, atau kepatuhan hukum.",
            title: "Pilihan dan permintaan penghapusan Anda",
          },
          collection: {
            body: "Kami memproses pesan dan detail pesanan yang Anda berikan, seperti pilihan produk, jumlah, draf pesanan, dan pesanan yang dikonfirmasi. Untuk percakapan WhatsApp, Meta memberikan pengenal pengirim dan pesan. Kami menggunakan pengenal pengirim untuk mengirim balasan dan menyimpan pengenal pseudonim yang dilindungi agar asisten dapat melanjutkan percakapan yang benar. Kami juga mencatat peristiwa teknis terbatas yang diperlukan untuk mencegah pemrosesan webhook ganda dan mengoperasikan layanan.",
            title: "Informasi yang kami proses",
          },
          contact: {
            body: "Untuk pertanyaan privasi atau permintaan data, hubungi operator melalui email dukungan atau nomor telepon yang ditampilkan di profil bisnis WhatsApp Reseller Order. Jangan menyertakan kata sandi, detail kartu pembayaran, atau dokumen identitas dalam permintaan Anda.",
            title: "Kontak",
          },
          retention: {
            body: "Catatan percakapan, draf, dan pesanan disimpan hanya selama diperlukan secara wajar untuk mengoperasikan layanan, mempertahankan riwayat pesanan, melindungi layanan, dan memenuhi kewajiban hukum yang berlaku. Ketika informasi tidak lagi diperlukan, informasi tersebut dihapus atau dihilangkan identitasnya melalui proses operasional yang wajar.",
            title: "Penyimpanan dan keamanan",
          },
          sharing: {
            body: "Informasi diproses oleh penyedia layanan yang membantu mengoperasikan aplikasi, termasuk Meta dan WhatsApp untuk perpesanan, OpenAI untuk menghasilkan respons AI, penyedia hosting dan basis data, serta Langfuse untuk pelacakan operasional yang telah disamarkan. Kami tidak menjual informasi pribadi. Kami dapat mengungkapkan informasi jika diwajibkan oleh hukum atau secara wajar diperlukan untuk melindungi pengguna, layanan, atau pihak lain.",
            title: "Penyedia layanan dan pengungkapan",
          },
          transfers: {
            body: "Penyedia layanan kami dapat memproses informasi di negara selain negara Anda. Kami menggunakan perlindungan dan langkah kontraktual yang ditawarkan penyedia tersebut jika berlaku. Layanan ini ditujukan untuk pemesanan bisnis dan tidak secara sengaja ditujukan kepada anak-anak.",
            title: "Pemrosesan internasional dan anak-anak",
          },
          updates: {
            body: "Kami dapat memperbarui kebijakan ini ketika layanan atau persyaratan hukum berubah. Tanggal berlaku di atas akan diperbarui ketika perubahan penting dipublikasikan.",
            title: "Pembaruan kebijakan",
          },
          usage: {
            body: "Kami menggunakan informasi untuk menjawab pertanyaan produk, menjaga konteks percakapan, membuat dan memperbarui draf pesanan, mengirimkan pesanan yang Anda setujui, menyediakan dukungan pelanggan, mencegah pemrosesan ganda, melindungi layanan, dan mendiagnosis masalah operasional.",
            title: "Cara kami menggunakan informasi",
          },
        },
        summary:
          "Reseller Order menggunakan informasi Anda untuk menyediakan percakapan pemesanan yang Anda minta. Kami membatasi penggunaannya untuk mengoperasikan, mengamankan, dan meningkatkan layanan tersebut.",
        title: "Kebijakan Privasi",
      },
    },
  },
} satisfies Resource;

export const i18n = createFrontendI18n({
  appName: "platform",
  defaultNamespace: "common",
  resources,
});
