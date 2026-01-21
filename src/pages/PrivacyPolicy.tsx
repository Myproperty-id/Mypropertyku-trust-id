import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
const PrivacyPolicy = () => {
  return <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-primary py-12">
          <div className="container-main">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Kebijakan Privasi
            </h1>
            <p className="text-primary-foreground/70 mt-2">
              Terakhir diperbarui: Januari 2026
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container-main max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <div className="bg-card rounded-xl border border-border p-8 mb-8">
                <p className="text-muted-foreground">Kami berkomitmen untuk melindungi privasi pengguna. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.</p>
              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. Informasi yang Kami Kumpulkan</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p><strong className="text-foreground">Informasi Akun:</strong> Nama lengkap, alamat email, nomor telepon, dan kata sandi saat Anda mendaftar.</p>
                    <p><strong className="text-foreground">Informasi Verifikasi (KYC):</strong> Kartu identitas (KTP), NPWP, dan dokumen pendukung lainnya untuk verifikasi identitas.</p>
                    <p><strong className="text-foreground">Informasi Properti:</strong> Detail properti yang Anda listing termasuk alamat, foto, dokumen sertifikat.</p>
                    <p><strong className="text-foreground">Data Penggunaan:</strong> Informasi tentang bagaimana Anda menggunakan Platform, termasuk halaman yang dikunjungi, pencarian, dan interaksi.</p>
                    <p><strong className="text-foreground">Informasi Perangkat:</strong> Jenis perangkat, sistem operasi, browser, dan alamat IP.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. Cara Kami Menggunakan Informasi</h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Menyediakan dan meningkatkan layanan Platform</li>
                    <li>Memverifikasi identitas pengguna dan properti</li>
                    <li>Memproses transaksi dan pembayaran</li>
                    <li>Mengirim notifikasi terkait layanan dan promosi (dengan persetujuan)</li>
                    <li>Mencegah penipuan dan aktivitas ilegal</li>
                    <li>Mematuhi kewajiban hukum</li>
                    <li>Menganalisis penggunaan untuk peningkatan layanan</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. Berbagi Informasi</h2>
                  <p className="text-muted-foreground mb-4">Kami dapat membagikan informasi Anda dengan:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong className="text-foreground">Penyedia Layanan:</strong> Pihak ketiga yang membantu operasional (pembayaran, hosting, analitik)</li>
                    <li><strong className="text-foreground">Mitra Verifikasi:</strong> Lembaga yang membantu proses verifikasi dokumen</li>
                    <li><strong className="text-foreground">Otoritas Hukum:</strong> Jika diwajibkan oleh hukum atau proses hukum</li>
                    <li><strong className="text-foreground">Pengguna Lain:</strong> Informasi properti publik yang Anda pilih untuk ditampilkan</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. Keamanan Data</h2>
                  <p className="text-muted-foreground mb-4">Kami menerapkan langkah-langkah keamanan untuk melindungi informasi Anda:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Enkripsi SSL/TLS untuk transmisi data</li>
                    <li>Enkripsi data sensitif saat disimpan</li>
                    <li>Kontrol akses ketat ke sistem internal</li>
                    <li>Pemantauan keamanan 24/7</li>
                    <li>Audit keamanan berkala</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Penyimpanan Data</h2>
                  <p className="text-muted-foreground">
                    Data Anda disimpan selama akun Anda aktif atau selama diperlukan untuk 
                    menyediakan layanan. Data verifikasi disimpan sesuai kewajiban hukum 
                    (minimal 5 tahun). Anda dapat meminta penghapusan akun, namun beberapa 
                    data mungkin tetap disimpan untuk keperluan legal.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. Hak Pengguna</h2>
                  <p className="text-muted-foreground mb-4">Anda memiliki hak untuk:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong className="text-foreground">Mengakses:</strong> Meminta salinan data pribadi Anda</li>
                    <li><strong className="text-foreground">Memperbaiki:</strong> Memperbarui informasi yang tidak akurat</li>
                    <li><strong className="text-foreground">Menghapus:</strong> Meminta penghapusan data (dengan batasan tertentu)</li>
                    <li><strong className="text-foreground">Membatasi:</strong> Membatasi pemrosesan data tertentu</li>
                    <li><strong className="text-foreground">Menolak:</strong> Menolak penggunaan data untuk pemasaran</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. Cookie</h2>
                  <p className="text-muted-foreground">
                    Kami menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman, 
                    menganalisis penggunaan, dan personalisasi konten. Anda dapat mengatur 
                    preferensi cookie melalui pengaturan browser.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">8. Perubahan Kebijakan</h2>
                  <p className="text-muted-foreground">
                    Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. 
                    Perubahan material akan diberitahukan melalui email atau notifikasi di Platform. 
                    Penggunaan berkelanjutan setelah perubahan berarti Anda menerima kebijakan yang diperbarui.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">9. Hubungi Kami</h2>
                  <p className="text-muted-foreground">
                    Untuk pertanyaan tentang Kebijakan Privasi atau permintaan terkait data pribadi, 
                    hubungi kami di:
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 mt-4">
                    <p className="text-foreground font-medium">MyProperty - Tim Privasi</p>
                    <p className="text-muted-foreground">Email: privacy@mypropertyku.id</p>
                    <p className="text-muted-foreground">Telepon: (021) 1234-5678</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default PrivacyPolicy;