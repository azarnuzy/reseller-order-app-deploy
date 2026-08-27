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
      product: {
        back: "Back to order chat",
        notFound: {
          description: "We couldn't find a product with this link. It may have been removed.",
          title: "Product not found",
        },
        orderCta: "Order via WhatsApp",
        whatsappMessage: 'Hi, I would like to order "{{title}}" (SKU: {{sku}}).',
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
      terms: {
        back: "Back to order chat",
        description:
          "These terms govern your use of the Reseller Order website and its WhatsApp ordering assistant.",
        effectiveDate: "Effective August 18, 2026",
        eyebrow: "Service terms",
        sections: {
          acceptance: {
            body: "By accessing or using Reseller Order, you agree to these Terms of Service and the Privacy Policy. If you do not agree, do not use the service. If you use the service for a business or another person, you confirm that you are authorized to act for them.",
            title: "Acceptance of these terms",
          },
          acceptableUse: {
            body: "You must not misuse the service, interfere with its operation, attempt unauthorized access, submit unlawful or harmful content, impersonate another person, probe or scrape the service, or use automated means that place an unreasonable load on it. Do not submit passwords, payment-card details, government identification documents, or other unnecessary sensitive information.",
            title: "Acceptable use",
          },
          ai: {
            body: "The ordering assistant uses an AI model and may misunderstand a request or produce an incorrect answer. Product availability, pricing, quantities, delivery details, and order totals shown by the deterministic application should be reviewed before you confirm an order. You remain responsible for checking the order summary you approve.",
            title: "Automated assistant",
          },
          changes: {
            body: "We may update the service or these terms when features, operations, or legal requirements change. Material changes will be published on this page with a revised effective date. Continued use after an update means you accept the revised terms. We may suspend access when reasonably necessary to secure, maintain, or protect the service.",
            title: "Changes and availability",
          },
          contact: {
            body: "Questions about these terms may be sent to azarnuzy@gmail.com or to the support contact displayed in the Reseller Order WhatsApp business profile.",
            title: "Contact",
          },
          disclaimers: {
            body: "The service is provided on an as-is and as-available basis to the extent permitted by applicable law. We do not promise uninterrupted or error-free operation, and we do not guarantee that AI-generated wording is complete or accurate. Nothing in these terms excludes a warranty or consumer right that cannot lawfully be excluded.",
            title: "Service disclaimer",
          },
          liability: {
            body: "To the extent permitted by applicable law, the operator is not responsible for indirect, incidental, special, consequential, or business-interruption losses arising from use of the service. This limitation does not apply where liability cannot legally be limited, including liability caused by fraud or intentional misconduct.",
            title: "Limitation of liability",
          },
          orders: {
            body: "Messages and draft orders are requests, not completed purchases. An order is submitted only after you review and confirm its summary. Availability, pricing, fulfillment, delivery, returns, and payment arrangements may require separate confirmation by the seller. Correct contact and delivery information is your responsibility.",
            title: "Orders and transactions",
          },
          privacy: {
            body: "Our Privacy Policy explains how messages, order information, WhatsApp identifiers, and technical records are processed. By using the service, you acknowledge those practices. You may request access, correction, or deletion as described in the Privacy Policy and Data Deletion Instructions.",
            title: "Privacy",
          },
          service: {
            body: "Reseller Order helps users ask about products, prepare order drafts, and submit approved orders through a web or WhatsApp conversation. Features may change as the service develops. The service is not an emergency, financial, medical, or legal advice channel.",
            title: "The service",
          },
          thirdParties: {
            body: "The service relies on third-party platforms and providers, including Meta and WhatsApp for messaging, OpenAI for AI processing, and hosting, database, and observability providers. Their separate terms and policies may apply. We do not control the availability or independent practices of those services.",
            title: "Third-party services",
          },
        },
        summary:
          "Use Reseller Order only for lawful ordering activity, review every order before confirming it, and do not provide unnecessary sensitive information.",
        title: "Terms of Service",
      },
      dataDeletion: {
        back: "Back to order chat",
        description:
          "These instructions explain how to request deletion of information associated with your Reseller Order website or WhatsApp conversation.",
        effectiveDate: "Effective August 18, 2026",
        eyebrow: "Your data choices",
        sections: {
          confirmation: {
            body: "After the request is verified and processed, we will confirm completion using the contact method associated with the request. Requests are handled within a reasonable period and within any deadline required by applicable law.",
            title: "Confirmation and timing",
          },
          contact: {
            body: "For questions or a deletion request, email azarnuzy@gmail.com or use the support contact displayed in the Reseller Order WhatsApp business profile. Do not send passwords, payment-card details, or identity documents unless specifically and lawfully requested for verification.",
            title: "Contact",
          },
          request: {
            body: "Email azarnuzy@gmail.com with the subject “Reseller Order data deletion request,” or send the request from the WhatsApp account used with the ordering assistant. State that you want your Reseller Order data deleted and identify the WhatsApp number or website conversation concerned. Use the same email address or WhatsApp account associated with the service where possible.",
            title: "How to submit a deletion request",
          },
          retention: {
            body: "Some records may be retained when reasonably necessary for security, fraud prevention, dispute resolution, accounting, tax, order fulfillment, or other legal obligations. Retained information will be limited to what is necessary and removed or de-identified when the applicable obligation ends.",
            title: "Information we may need to retain",
          },
          scope: {
            body: "A verified request may cover the protected identifier linking your WhatsApp account to the service, conversation records, draft orders, profile information, and other personal information controlled by Reseller Order. We will explain if part of the request cannot be completed because of a legal or operational obligation.",
            title: "What we will delete",
          },
          thirdParties: {
            body: "Deleting information from Reseller Order does not delete your WhatsApp or Meta account, messages stored on your devices, or information independently controlled by third-party providers. Use the privacy controls provided by those services for their copies of your information.",
            title: "Third-party accounts and copies",
          },
          verification: {
            body: "We may ask you to verify control of the relevant WhatsApp account, email address, or conversation before deleting data. We request only the minimum information reasonably needed to prevent unauthorized deletion. If verification is not possible, we may be unable to complete the request.",
            title: "Identity verification",
          },
        },
        summary:
          "You can request deletion by contacting us from the WhatsApp account or email associated with your Reseller Order activity.",
        title: "Data Deletion Instructions",
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
      product: {
        back: "Kembali ke chat pesanan",
        notFound: {
          description: "Kami tidak menemukan produk dengan tautan ini. Mungkin sudah dihapus.",
          title: "Produk tidak ditemukan",
        },
        orderCta: "Pesan via WhatsApp",
        whatsappMessage: 'Halo, saya ingin memesan "{{title}}" (SKU: {{sku}}).',
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
      terms: {
        back: "Kembali ke chat pesanan",
        description:
          "Ketentuan ini mengatur penggunaan situs web Reseller Order dan asisten pemesanannya di WhatsApp.",
        effectiveDate: "Berlaku mulai 18 Agustus 2026",
        eyebrow: "Ketentuan layanan",
        sections: {
          acceptance: {
            body: "Dengan mengakses atau menggunakan Reseller Order, Anda menyetujui Ketentuan Layanan ini dan Kebijakan Privasi. Jika tidak setuju, jangan gunakan layanan. Jika Anda menggunakan layanan untuk suatu bisnis atau orang lain, Anda menyatakan bahwa Anda berwenang untuk bertindak atas nama mereka.",
            title: "Penerimaan ketentuan",
          },
          acceptableUse: {
            body: "Anda tidak boleh menyalahgunakan layanan, mengganggu operasinya, mencoba mendapatkan akses tanpa izin, mengirim konten yang melanggar hukum atau berbahaya, menyamar sebagai orang lain, menyelidiki atau mengambil data secara massal, atau menggunakan sarana otomatis yang membebani layanan secara tidak wajar. Jangan mengirim kata sandi, detail kartu pembayaran, dokumen identitas pemerintah, atau informasi sensitif lain yang tidak diperlukan.",
            title: "Penggunaan yang diperbolehkan",
          },
          ai: {
            body: "Asisten pemesanan menggunakan model AI dan dapat salah memahami permintaan atau memberikan jawaban yang keliru. Ketersediaan produk, harga, jumlah, detail pengiriman, dan total pesanan yang ditampilkan oleh aplikasi deterministik harus diperiksa sebelum Anda mengonfirmasi pesanan. Anda bertanggung jawab memeriksa ringkasan pesanan yang Anda setujui.",
            title: "Asisten otomatis",
          },
          changes: {
            body: "Kami dapat memperbarui layanan atau ketentuan ini ketika fitur, operasi, atau persyaratan hukum berubah. Perubahan penting akan dipublikasikan pada halaman ini dengan tanggal berlaku yang baru. Penggunaan berkelanjutan setelah pembaruan berarti Anda menerima ketentuan yang diperbarui. Kami dapat menangguhkan akses jika secara wajar diperlukan untuk mengamankan, memelihara, atau melindungi layanan.",
            title: "Perubahan dan ketersediaan",
          },
          contact: {
            body: "Pertanyaan tentang ketentuan ini dapat dikirim ke azarnuzy@gmail.com atau ke kontak dukungan yang ditampilkan di profil bisnis WhatsApp Reseller Order.",
            title: "Kontak",
          },
          disclaimers: {
            body: "Layanan disediakan sebagaimana adanya dan sebagaimana tersedia sejauh diizinkan oleh hukum yang berlaku. Kami tidak menjanjikan operasi tanpa gangguan atau kesalahan dan tidak menjamin bahwa tulisan yang dihasilkan AI lengkap atau akurat. Ketentuan ini tidak mengesampingkan jaminan atau hak konsumen yang secara hukum tidak dapat dikesampingkan.",
            title: "Penafian layanan",
          },
          liability: {
            body: "Sejauh diizinkan oleh hukum yang berlaku, operator tidak bertanggung jawab atas kerugian tidak langsung, insidental, khusus, konsekuensial, atau gangguan bisnis yang timbul dari penggunaan layanan. Batasan ini tidak berlaku jika tanggung jawab secara hukum tidak dapat dibatasi, termasuk tanggung jawab akibat penipuan atau kesengajaan.",
            title: "Batasan tanggung jawab",
          },
          orders: {
            body: "Pesan dan draf pesanan merupakan permintaan, bukan pembelian yang telah selesai. Pesanan dikirimkan hanya setelah Anda meninjau dan mengonfirmasi ringkasannya. Ketersediaan, harga, pemenuhan, pengiriman, pengembalian, dan pengaturan pembayaran mungkin memerlukan konfirmasi terpisah dari penjual. Anda bertanggung jawab memberikan informasi kontak dan pengiriman yang benar.",
            title: "Pesanan dan transaksi",
          },
          privacy: {
            body: "Kebijakan Privasi menjelaskan cara pesan, informasi pesanan, pengenal WhatsApp, dan catatan teknis diproses. Dengan menggunakan layanan, Anda mengakui praktik tersebut. Anda dapat meminta akses, koreksi, atau penghapusan sebagaimana dijelaskan dalam Kebijakan Privasi dan Petunjuk Penghapusan Data.",
            title: "Privasi",
          },
          service: {
            body: "Reseller Order membantu pengguna menanyakan produk, menyiapkan draf pesanan, dan mengirim pesanan yang telah disetujui melalui percakapan web atau WhatsApp. Fitur dapat berubah seiring pengembangan layanan. Layanan ini bukan saluran darurat atau penyedia nasihat keuangan, medis, maupun hukum.",
            title: "Layanan",
          },
          thirdParties: {
            body: "Layanan bergantung pada platform dan penyedia pihak ketiga, termasuk Meta dan WhatsApp untuk perpesanan, OpenAI untuk pemrosesan AI, serta penyedia hosting, basis data, dan observabilitas. Ketentuan dan kebijakan mereka dapat berlaku secara terpisah. Kami tidak mengendalikan ketersediaan atau praktik independen layanan tersebut.",
            title: "Layanan pihak ketiga",
          },
        },
        summary:
          "Gunakan Reseller Order hanya untuk kegiatan pemesanan yang sah, periksa setiap pesanan sebelum mengonfirmasi, dan jangan memberikan informasi sensitif yang tidak diperlukan.",
        title: "Ketentuan Layanan",
      },
      dataDeletion: {
        back: "Kembali ke chat pesanan",
        description:
          "Petunjuk ini menjelaskan cara meminta penghapusan informasi yang terkait dengan percakapan Anda di situs web atau WhatsApp Reseller Order.",
        effectiveDate: "Berlaku mulai 18 Agustus 2026",
        eyebrow: "Pilihan data Anda",
        sections: {
          confirmation: {
            body: "Setelah permintaan diverifikasi dan diproses, kami akan mengonfirmasi penyelesaian melalui metode kontak yang terkait dengan permintaan tersebut. Permintaan ditangani dalam jangka waktu yang wajar dan sesuai batas waktu yang diwajibkan hukum yang berlaku.",
            title: "Konfirmasi dan waktu pemrosesan",
          },
          contact: {
            body: "Untuk pertanyaan atau permintaan penghapusan, kirim email ke azarnuzy@gmail.com atau gunakan kontak dukungan yang ditampilkan di profil bisnis WhatsApp Reseller Order. Jangan mengirim kata sandi, detail kartu pembayaran, atau dokumen identitas kecuali diminta secara khusus dan sah untuk verifikasi.",
            title: "Kontak",
          },
          request: {
            body: "Kirim email ke azarnuzy@gmail.com dengan subjek “Permintaan penghapusan data Reseller Order,” atau kirim permintaan dari akun WhatsApp yang digunakan dengan asisten pemesanan. Nyatakan bahwa Anda ingin data Reseller Order Anda dihapus dan sebutkan nomor WhatsApp atau percakapan situs web terkait. Jika memungkinkan, gunakan alamat email atau akun WhatsApp yang sama dengan yang terkait dengan layanan.",
            title: "Cara mengajukan permintaan penghapusan",
          },
          retention: {
            body: "Sebagian catatan dapat disimpan jika secara wajar diperlukan untuk keamanan, pencegahan penipuan, penyelesaian sengketa, pembukuan, pajak, pemenuhan pesanan, atau kewajiban hukum lainnya. Informasi yang disimpan akan dibatasi pada yang diperlukan dan dihapus atau dihilangkan identitasnya setelah kewajiban yang berlaku berakhir.",
            title: "Informasi yang mungkin perlu disimpan",
          },
          scope: {
            body: "Permintaan yang terverifikasi dapat mencakup pengenal terlindungi yang menghubungkan akun WhatsApp Anda ke layanan, catatan percakapan, draf pesanan, informasi profil, dan informasi pribadi lain yang dikendalikan Reseller Order. Kami akan menjelaskan jika sebagian permintaan tidak dapat diselesaikan karena kewajiban hukum atau operasional.",
            title: "Data yang akan kami hapus",
          },
          thirdParties: {
            body: "Menghapus informasi dari Reseller Order tidak menghapus akun WhatsApp atau Meta Anda, pesan yang tersimpan di perangkat Anda, atau informasi yang dikendalikan secara independen oleh penyedia pihak ketiga. Gunakan kontrol privasi yang disediakan layanan tersebut untuk salinan informasi yang mereka miliki.",
            title: "Akun dan salinan pihak ketiga",
          },
          verification: {
            body: "Kami mungkin meminta Anda memverifikasi kendali atas akun WhatsApp, alamat email, atau percakapan terkait sebelum menghapus data. Kami hanya meminta informasi minimum yang secara wajar diperlukan untuk mencegah penghapusan tanpa izin. Jika verifikasi tidak memungkinkan, kami mungkin tidak dapat menyelesaikan permintaan.",
            title: "Verifikasi identitas",
          },
        },
        summary:
          "Anda dapat meminta penghapusan dengan menghubungi kami dari akun WhatsApp atau email yang terkait dengan aktivitas Reseller Order Anda.",
        title: "Petunjuk Penghapusan Data",
      },
    },
  },
} satisfies Resource;

export const i18n = createFrontendI18n({
  appName: "platform",
  defaultNamespace: "common",
  resources,
});
