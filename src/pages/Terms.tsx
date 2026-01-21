import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
const Terms = () => {
  return <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-primary py-12">
          <div className="container-main">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Syarat & Ketentuan
            </h1>
            <p className="text-primary-foreground/70 mt-2">
              Terakhir diperbarui: Januari 2026
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container-main max-w-4xl">
            <div className="bg-card rounded-xl border border-border p-8 mb-8">
              <p className="text-muted-foreground">Dengan mengakses dan menggunakan platform, Anda menyetujui untuk terikat dengan Syarat dan Ketentuan berikut. Jika Anda tidak setuju, mohon untuk tidak menggunakan Platform.</p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Definisi</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">"Platform"</strong>"Platform" merujuk pada website dan aplikasi Mypropertyku</li>
                  <li><strong className="text-foreground">"Pengguna"</strong> merujuk pada setiap orang yang mengakses atau menggunakan Platform</li>
                  <li><strong className="text-foreground">"Penjual"</strong> merujuk pada Pengguna yang mendaftarkan properti untuk dijual/disewakan</li>
                  <li><strong className="text-foreground">"Pembeli"</strong> merujuk pada Pengguna yang mencari properti</li>
                  <li><strong className="text-foreground">"Konten"</strong> merujuk pada semua informasi, teks, gambar, dan materi di Platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Penggunaan Platform</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Pengguna setuju untuk:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Memberikan informasi yang akurat dan lengkap saat mendaftar</li>
                    <li>Menjaga kerahasiaan akun dan kata sandi</li>
                    <li>Tidak menggunakan Platform untuk tujuan ilegal</li>
                    <li>Tidak menyamar sebagai orang lain atau entitas lain</li>
                    <li>Tidak mengganggu atau merusak operasi Platform</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Kewajiban Penjual</h2>
                <p className="text-muted-foreground mb-4">Penjual yang mendaftarkan properti bertanggung jawab untuk:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Memastikan akurasi semua informasi properti yang didaftarkan</li>
                  <li>Memiliki hak legal untuk menjual/menyewakan properti</li>
                  <li>Menyediakan dokumen yang diminta untuk verifikasi</li>
                  <li>Tidak mendaftarkan properti yang sedang dalam sengketa</li>
                  <li>Memperbarui status properti secara tepat waktu</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Proses Verifikasi</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    MyProperty melakukan verifikasi properti sebagai layanan tambahan. 
                    Verifikasi mencakup pengecekan dokumen sertifikat dan status sengketa 
                    berdasarkan informasi yang tersedia.
                  </p>
                  <p>
                    <strong className="text-foreground">Penting:</strong> Verifikasi MyProperty tidak 
                    menggantikan due diligence yang harus dilakukan pembeli. Kami menyarankan 
                    pembeli untuk tetap melakukan pengecekan independen sebelum transaksi.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Larangan</h2>
                <p className="text-muted-foreground mb-4">Pengguna dilarang untuk:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Mendaftarkan properti dengan informasi palsu atau menyesatkan</li>
                  <li>Melakukan penipuan dalam bentuk apapun</li>
                  <li>Menggunakan foto atau konten tanpa izin pemilik</li>
                  <li>Melakukan spam atau pesan massal yang tidak diminta</li>
                  <li>Mengumpulkan data Pengguna lain tanpa izin</li>
                  <li>Melanggar hak kekayaan intelektual pihak manapun</li>
                  <li>Menyebarkan malware atau kode berbahaya</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Tanggung Jawab Platform</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>MyProperty bertanggung jawab untuk:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Menyediakan Platform yang berfungsi dengan baik</li>
                    <li>Melakukan verifikasi sesuai prosedur yang ditetapkan</li>
                    <li>Menjaga keamanan data Pengguna</li>
                    <li>Menangani keluhan sesuai prosedur</li>
                  </ul>
                  <p>MyProperty <strong className="text-foreground">TIDAK</strong> bertanggung jawab atas:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Transaksi yang dilakukan di luar Platform</li>
                    <li>Kerugian akibat informasi yang tidak akurat dari Penjual</li>
                    <li>Sengketa antara Pembeli dan Penjual</li>
                    <li>Keputusan pembelian yang diambil Pengguna</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Penanganan Sengketa</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Sengketa antara Pengguna harus diselesaikan secara langsung antar pihak. Mypropertyku dapat membantu memediasi namun tidak wajib untuk menyelesaikan sengketa.</p>
                  <p>
                    Untuk sengketa dengan Platform, Pengguna setuju untuk menyelesaikan 
                    melalui mediasi terlebih dahulu sebelum menempuh jalur hukum.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Penangguhan dan Penghentian</h2>
                <p className="text-muted-foreground">Mypropertyku berhak untuk menangguhkan atau menghentikan akun Pengguna yang melanggar Syarat dan Ketentuan ini, tanpa pemberitahuan sebelumnya untuk pelanggaran serius.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Hak Kekayaan Intelektual</h2>
                <p className="text-muted-foreground">Semua konten di Platform, termasuk logo, desain, dan teks adalah milik Mypropertyku dan dilindungi oleh hukum hak cipta. Pengguna tidak diizinkan untuk menggunakan konten tersebut tanpa izin tertulis.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">10. Perubahan Syarat</h2>
                <p className="text-muted-foreground">Mypropertyku dapat mengubah Syarat dan Ketentuan ini kapan saja. Perubahan akan diberitahukan melalui email atau notifikasi di Platform. Penggunaan berkelanjutan setelah perubahan berarti penerimaan syarat baru.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">11. Hukum yang Berlaku</h2>
                <p className="text-muted-foreground">
                  Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan 
                  hukum Republik Indonesia. Setiap sengketa akan diselesaikan di 
                  pengadilan yang berwenang di Jakarta.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">12. Kontak</h2>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-foreground font-medium">MyProperty - Tim Legal</p>
                  <p className="text-muted-foreground">Email: legal@mypropertyku.id</p>
                  <p className="text-muted-foreground">Telepon: (021) 1234-5678</p>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default Terms;