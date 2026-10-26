# PRD.md — GARDA-SIM AI
## Product Requirements Document

**Nama produk:** GARDA-SIM AI  
**Tagline kerja:** Simulate the impact. Explain the trade-offs. Keep humans in control.  
**Kategori:** Defensive cybersecurity decision-support web application  
**Versi dokumen:** 1.0  
**Status:** Draft spesifikasi produk untuk implementasi MVP hackathon  
**Tanggal:** 26 Oktober 2026  
**Sumber utama:** `DESIGN.md`, `ARSITEKTUR.md`, `SKILLS.md`, dan desain UI hasil ekspor Figma yang tersedia  
**Bahasa antarmuka:** Bahasa Inggris sesuai spesifikasi UI; dokumentasi dan penjelasan pengembangan dapat menggunakan Bahasa Indonesia.

> **Status dokumen:** PRD ini menjelaskan kebutuhan dan target sistem. Dokumen ini bukan bukti bahwa fitur, integrasi, atau infrastruktur telah diimplementasikan. Status aktual harus dicatat dan diverifikasi di `IMPLEMENTATION_STATUS.md`.

---

## 1. Ringkasan Eksekutif

GARDA-SIM AI adalah aplikasi web untuk membantu analis keamanan siber mengevaluasi pilihan respons insiden melalui lingkungan simulasi yang menggunakan bukti keamanan sintetis dan topologi layanan IT/OT virtual. Sistem menyajikan beberapa strategi respons, memperkirakan dampak keamanan dan operasional berdasarkan model simulasi yang terdokumentasi, memeriksa aturan keselamatan secara deterministik, lalu menyajikan penjelasan yang dapat ditinjau manusia.

GARDA-SIM AI tidak dimaksudkan untuk mengendalikan sistem produksi, jaringan militer, atau infrastruktur OT nyata. Semua aset, identitas, log, insiden, dan aksi respons dalam MVP bersifat sintetis dan berjalan di lingkungan simulasi. Sistem tidak mengeksekusi tindakan containment nyata.

### 1.1 Masalah yang ditangani

Dalam investigasi insiden, sebuah respons yang tampak efektif untuk membatasi ancaman dapat memiliki konsekuensi operasional terhadap layanan lain yang bergantung pada aset terdampak. Daftar rekomendasi saja tidak selalu cukup untuk memperlihatkan trade-off tersebut. GARDA-SIM AI dirancang untuk membuat konsekuensi hipotetis dari alternatif respons lebih eksplisit sebelum operator memilih keputusan.

### 1.2 Pendekatan solusi

Sistem menggabungkan lima kemampuan inti:

1. **Evidence-grounded investigation:** menghubungkan insiden dengan bukti sintetis yang dapat ditelusuri.
2. **Virtual dependency model:** memetakan aset virtual dan dependensi layanan.
3. **Deterministic impact simulation:** mengevaluasi kandidat respons terhadap skenario dan topologi versi tertentu.
4. **Deterministic safety validation:** menerapkan aturan keselamatan yang dapat diuji, bukan menyerahkan keputusan keselamatan kepada model AI.
5. **Explainable human review:** menjelaskan manfaat, dampak, asumsi, ketidakpastian, dan alternatif untuk ditinjau operator.

### 1.3 Hipotesis produk

Hipotesis yang akan diuji adalah bahwa kombinasi konteks bukti, simulasi dampak layanan, safety constraints deterministik, dan penjelasan AI dapat membantu operator membandingkan strategi respons secara lebih transparan dibandingkan pendekatan baseline yang lebih sederhana.

Hipotesis tersebut bukan klaim novelty global atau bukti bahwa sistem lebih baik. Klaim yang lebih kuat hanya boleh dibuat setelah evaluasi terukur, reproducible, dan dokumentasi tinjauan literatur yang relevan.

---

## 2. Visi, Misi, dan Prinsip Produk

### 2.1 Visi

Membantu pengambil keputusan keamanan memahami trade-off respons insiden melalui simulasi yang transparan, dapat ditelusuri, dan tetap berada di bawah kendali manusia.

### 2.2 Misi MVP

Menyediakan alur end-to-end yang memungkinkan pengguna:

- Memilih atau memuat skenario sintetis.
- Meninjau insiden dan bukti terkait.
- Memahami hubungan dependensi antar-aset virtual.
- Membandingkan alternatif respons.
- Melihat estimasi dampak dan pelanggaran safety constraints.
- Meninjau penjelasan AI beserta bukti, asumsi, dan ketidakpastian.
- Mencatat keputusan review simulatif.
- Menjalankan eksperimen yang dapat direproduksi.
- Melihat audit trail dan membuat laporan.

### 2.3 Prinsip produk yang tidak dapat ditawar

- **Simulation-first:** tidak ada koneksi atau tindakan ke sistem produksi.
- **Safety by design:** safety policy dievaluasi oleh kode deterministik.
- **Human in control:** AI tidak menyetujui atau menjalankan respons kritis secara otonom.
- **Evidence-grounded:** klaim harus merujuk pada bukti atau hasil simulasi yang tersedia.
- **Reproducible:** input, konfigurasi, versi model, dan output run dicatat.
- **Honest metrics:** nilai ilustratif, hasil terukur, dan hipotesis dibedakan dengan jelas.
- **Progressive complexity:** UI menampilkan informasi penting terlebih dahulu dan detail teknis saat dibutuhkan.
- **Maintainability:** modul, kontrak API, skema data, dan komponen UI harus memiliki batas tanggung jawab yang jelas.
- **Accessible by default:** status tidak disampaikan hanya melalui warna dan semua alur utama dapat digunakan dengan keyboard.
- **No AI slop:** desain tidak boleh menjadi kumpulan template generik, kartu berulang, dekorasi neon, atau animasi tanpa fungsi.

---

## 3. Pengguna dan Persona

### 3.1 Persona utama

#### A. SOC Analyst / Incident Responder
**Kebutuhan:** memahami insiden, menelusuri bukti, membandingkan respons, dan mengetahui layanan yang mungkin terdampak.  
**Kesulitan:** konteks tersebar, konsekuensi respons tidak selalu terlihat, rekomendasi sering kurang menjelaskan trade-off.  
**Ukuran keberhasilan:** dapat menemukan bukti yang relevan dan membandingkan kandidat respons dalam alur yang konsisten.

#### B. IT/OT Security Engineer
**Kebutuhan:** memahami dependensi virtual dan mengevaluasi risiko gangguan layanan.  
**Kesulitan:** tindakan terhadap satu komponen dapat memengaruhi komponen lain yang bergantung padanya.  
**Ukuran keberhasilan:** dapat mengidentifikasi dependensi terdampak dan memahami alasan simulasi memprediksi degradasi layanan.

#### C. Security Supervisor / Reviewer
**Kebutuhan:** memeriksa dasar rekomendasi, batas keselamatan, hasil eksperimen, dan keputusan review.  
**Kesulitan:** sulit membedakan bukti, inferensi, dan narasi AI jika UI tidak memberi label jelas.  
**Ukuran keberhasilan:** dapat meninjau rekomendasi dan menelusuri asal hasilnya.

#### D. Researcher / Hackathon Evaluator
**Kebutuhan:** memahami metode, asumsi, baseline, metrik, reproducibility, dan batasan sistem.  
**Kesulitan:** klaim performa tanpa metode atau data yang dapat diperiksa.  
**Ukuran keberhasilan:** dapat menjalankan atau memeriksa eksperimen dan membedakan hasil terukur dari placeholder.

### 3.2 Peran MVP

MVP dapat menggunakan satu peran utama `user` dengan hak akses pemilik akun dan satu peran `admin` untuk pengelolaan terbatas jika memang dibutuhkan. Model izin harus tetap sederhana sampai kebutuhan multi-tenant atau organisasi dikonfirmasi.

Tidak perlu membangun RBAC kompleks, organisasi, atau billing pada MVP jika tidak menjadi kebutuhan eksplisit hackathon.

---

## 4. Tujuan dan Non-Goals

### 4.1 Tujuan MVP

1. Mengubah desain Figma yang sudah tersedia menjadi aplikasi web responsif.
2. Menyediakan landing page publik dan halaman informasi produk.
3. Menyediakan autentikasi server-backed yang aman.
4. Menyediakan dashboard dan halaman investigasi untuk dataset sintetis yang konsisten.
5. Memvisualisasikan topologi aset virtual dan dependensi layanan.
6. Membandingkan kandidat strategi respons melalui simulator deterministik.
7. Menegakkan safety constraints secara deterministik.
8. Menyajikan rekomendasi dan penjelasan AI yang mengacu pada bukti serta output simulator.
9. Menyimpan simulation runs dan hasil eksperimen agar dapat ditinjau ulang.
10. Menyediakan audit trail prototipe dan laporan.
11. Menyediakan test suite untuk logika simulasi, safety policy, API, dan alur UI utama.
12. Menyediakan setup lokal dan dokumentasi yang dapat diikuti pengembang lain.

### 4.2 Non-goals MVP

- Koneksi ke jaringan militer, industri, atau produksi nyata.
- Eksekusi tindakan containment pada sistem nyata.
- Pengendalian OT nyata.
- Scanning, exploitation, atau disruption terhadap sistem pihak ketiga.
- Pengumpulan kredensial, rahasia, atau data pribadi yang tidak dibutuhkan.
- Keputusan keamanan berdampak tinggi secara otonom.
- Streaming telemetry real-time dari infrastruktur produksi.
- Multi-tenant enterprise yang kompleks kecuali diwajibkan oleh kebutuhan kompetisi.
- Billing, subscription management, dan marketplace.
- Klaim sertifikasi, kepatuhan formal, atau validasi dunia nyata tanpa bukti.
- Klaim bahwa pendekatan ini belum pernah dilakukan sebelumnya.
- Penggunaan AI sebagai sumber kebenaran untuk angka simulasi atau keputusan safety policy.

---

## 5. Ruang Lingkup Website dan Information Architecture

Website dibagi menjadi tiga area dengan layout dan akses yang jelas: public website, authentication/onboarding, dan authenticated application.

### 5.1 Public website

| Route | Halaman | Kebutuhan utama |
|---|---|---|
| `/` | Landing page | Value proposition, hero, product preview, features, workflow, safety, FAQ, CTA, footer |
| `/features` | Features | Penjelasan fitur berbasis alur produk |
| `/how-it-works` | How It Works | Alur dari evidence sampai human review |
| `/about` | About | Misi, scope, prinsip desain, batasan produk |
| `/documentation` | Documentation | Konsep simulator, synthetic data, safety model, penggunaan |
| `/faq` | FAQ | Jawaban tentang data, AI, simulasi, keselamatan, dan keterbatasan |
| `/contact` | Contact | Form kontak dengan validasi; integrasi pengiriman hanya jika tersedia |
| `/privacy` | Privacy Policy | Kebijakan privasi yang sesuai dengan implementasi aktual |
| `/terms` | Terms of Service | Ketentuan penggunaan prototipe |
| `/security` | Security | Prinsip keamanan dan batas sistem tanpa klaim sertifikasi palsu |

Landing page harus konsisten dengan desain Figma dan menyampaikan bahwa produk adalah platform simulasi defensif. Jangan menggunakan logo pelanggan, testimoni, sertifikasi, atau statistik yang tidak memiliki sumber.

### 5.2 Authentication dan onboarding

| Route | Halaman | Kebutuhan utama |
|---|---|---|
| `/login` | Login | Email, password, validasi, error, loading, link recovery |
| `/signup` | Sign Up | Nama, email, password, konfirmasi, persetujuan Terms/Privacy |
| `/forgot-password` | Forgot Password | Permintaan reset dengan pesan aman |
| `/reset-password` | Reset Password | Validasi token di server, expired/invalid states |
| `/verify-email` | Email Verification | Status verifikasi dan resend jika didukung |
| `/onboarding` | Onboarding | Pengenalan Simulation Lab, evidence, simulator, safety, human review |

Callback route hanya ditambahkan bila dibutuhkan provider autentikasi yang dipilih.

### 5.3 Authenticated application

| Route | Halaman | Kebutuhan utama |
|---|---|---|
| `/app` | Overview Dashboard | Ringkasan insiden, layanan, rekomendasi, dan run |
| `/app/incidents` | Incident List | Search, filters, sorting, pagination |
| `/app/incidents/:id` | Incident Detail | Konteks, severity, evidence, affected assets, timeline, review |
| `/app/evidence` | Evidence & Timeline | Log sintetis, timeline, filter, detail evidence |
| `/app/simulator` | Response Simulator | Scenario selection, strategi, simulasi, comparison, explanation |
| `/app/digital-twin` | IT/OT Digital Twin | Topologi virtual, dependencies, impact overlay |
| `/app/recommendations` | AI Recommendations | Rekomendasi, evidence, uncertainty, review state |
| `/app/experiments` | Experiments & Evaluation | Konfigurasi, run, baseline, metrik, hasil |
| `/app/reports` | Reports | Preview dan ekspor laporan |
| `/app/audit-trail` | Audit Trail | Event history, filter, detail |
| `/app/settings` | Settings | Preferensi, environment, AI status, safety, data |
| `/app/profile` | Profile | Profil pengguna dan pengaturan akun |
| `/app/notifications` | Notifications | Notifikasi dan navigasi ke item terkait |

Tambahkan halaman `403`, `404`, dan `500` yang sesuai dengan visual system. Semua halaman terlindungi harus memeriksa sesi dan otorisasi di server, bukan hanya menyembunyikan UI di frontend.

### 5.4 Shared application shell

- Sidebar desktop dengan navigasi berkelompok.
- Top bar dengan breadcrumb, global search, notifications, user menu, dan environment indicator.
- Label yang terlihat: `SIMULATION ONLY`.
- Environment: `Simulation Lab` / `Synthetic Test Environment`.
- Sidebar dapat menjadi drawer pada mobile.
- Active route harus terlihat.
- Setiap primary action harus memiliki tujuan atau aksi yang benar-benar berfungsi.

---

## 6. Functional Requirements

Prioritas:
- **P0:** wajib untuk demo MVP.
- **P1:** penting jika waktu dan stabilitas memungkinkan.
- **P2:** pengembangan lanjutan.

### 6.1 Public website

**FR-PUB-01 — Landing page (P0)**  
Sistem harus menampilkan value proposition, product preview, fitur, workflow, safety/explainability, evaluasi, FAQ preview, CTA, dan footer.

**FR-PUB-02 — Navigasi (P0)**  
Semua tautan navigasi harus mengarah ke route yang benar. Mobile navigation harus dapat dibuka dan ditutup dengan keyboard maupun pointer.

**FR-PUB-03 — Product information pages (P1)**  
Halaman Features, How It Works, About, Documentation, FAQ, Contact, Privacy, Terms, dan Security mengikuti design system yang sama.

**FR-PUB-04 — SEO metadata (P1)**  
Public pages menyediakan title, description, canonical/metadata yang sesuai, Open Graph metadata bila relevan, dan struktur heading semantik.

**FR-PUB-05 — Contact form (P2)**  
Jika tidak ada email provider atau backend, tampilkan status integrasi belum tersedia. Jangan mengklaim pesan terkirim bila tidak benar-benar dikirim.

### 6.2 Authentication

**FR-AUTH-01 — Registration (P0)**  
Pengguna dapat membuat akun melalui server. Email dan password divalidasi di client dan server.

**FR-AUTH-02 — Login/logout (P0)**  
Pengguna dapat login dan logout. Session state harus konsisten di seluruh route.

**FR-AUTH-03 — Password security (P0)**  
Password disimpan menggunakan password hashing yang sesuai. Password tidak boleh dicatat ke log.

**FR-AUTH-04 — Protected routes (P0)**  
Route `/app/*` memerlukan sesi valid dan pemeriksaan otorisasi server-side.

**FR-AUTH-05 — Password recovery (P1)**  
Alur reset password menggunakan token yang aman, memiliki masa berlaku, dan tidak mengungkapkan keberadaan email melalui pesan publik.

**FR-AUTH-06 — Email verification (P1)**  
Jika email provider dikonfigurasi, dukung verification flow. Jika tidak, tandai keterbatasan mode development dengan jelas.

**FR-AUTH-07 — Session safety (P0)**  
Gunakan cookie `HttpOnly`, `Secure` pada HTTPS, `SameSite` yang sesuai, proteksi CSRF sesuai arsitektur, expiry, dan logout invalidation.

**FR-AUTH-08 — Rate limiting (P1)**  
Batasi percobaan login, reset password, dan endpoint sensitif.

**FR-AUTH-09 — No fake auth (P0)**  
Jangan mengimplementasikan autentikasi menggunakan password hardcoded, boolean frontend, atau local storage sebagai satu-satunya otoritas.

### 6.3 Incident management

**FR-INC-01 — Incident list (P0)**  
Tampilkan daftar insiden sintetis dengan ID, title, severity, confidence label, affected services, status, last updated, dan detail link.

**FR-INC-02 — Search/filter (P0)**  
Dukung pencarian berdasarkan ID/title/service dan filter severity, status, confidence, serta date bila data mendukung.

**FR-INC-03 — Incident detail (P0)**  
Tampilkan ringkasan, detection source, evidence references, affected virtual assets, timeline, operational impact, strategi kandidat, notes, dan audit history.

**FR-INC-04 — Data consistency (P0)**  
Incident ID, asset ID, timestamp, status, dan relasi harus konsisten di dashboard, evidence, simulator, recommendations, dan reports.

**FR-INC-05 — Synthetic labeling (P0)**  
Semua insiden demo harus jelas dilabeli synthetic/demo.

### 6.4 Evidence and timeline

**FR-EVD-01 — Evidence list (P0)**  
Tampilkan timestamp, source, event type, synthetic actor, virtual asset, severity, dan evidence reference.

**FR-EVD-02 — Filters (P0)**  
Dukung pencarian, filter, dan urutan waktu.

**FR-EVD-03 — Evidence details (P0)**  
Pengguna dapat membuka detail log sintetis dan melihat field yang relevan.

**FR-EVD-04 — Claim provenance (P0)**  
UI membedakan `Observed Evidence`, `Derived Assessment`, dan `AI-Generated Explanation`.

**FR-EVD-05 — No fabricated evidence (P0)**  
AI tidak boleh membuat evidence ID atau event yang kemudian ditampilkan sebagai fakta yang diamati.

### 6.5 Virtual topology / Digital Twin

**FR-TWIN-01 — Topology graph (P0)**  
Tampilkan node aset virtual dan directed dependency edges.

**FR-TWIN-02 — Asset selection (P0)**  
Pengguna dapat memilih node dan melihat tipe, ID sintetis, status kesehatan simulatif, dependencies, dependents, constraints, dan event terkait.

**FR-TWIN-03 — Graph controls (P1)**  
Sediakan zoom, pan, search, legend, dan fit-to-screen.

**FR-TWIN-04 — Impact overlay (P0)**  
Tampilkan node yang terdampak oleh sebuah simulasi dan jelaskan hubungan propagasinya.

**FR-TWIN-05 — Baseline reset (P0)**  
Pengguna dapat kembali ke baseline topology tanpa mengubah data sumber.

**FR-TWIN-06 — Synthetic boundary (P0)**  
Graph hanya merepresentasikan aset virtual fiktif. Tidak boleh menampilkan seolah-olah sistem terhubung ke infrastruktur nyata.

### 6.6 Response Simulator

**FR-SIM-01 — Scenario selection (P0)**  
Pengguna dapat memilih skenario dan insiden sintetis yang valid.

**FR-SIM-02 — Candidate strategies (P0)**  
Sistem menyediakan kandidat respons, minimal:
- Revoke suspicious synthetic session.
- Restrict access to a virtual service.
- Request additional verification.
- Isolate a simulated asset only when the scenario permits it.

**FR-SIM-03 — Strategy evaluation (P0)**  
Setiap kandidat dievaluasi dengan model yang terdokumentasi untuk security benefit, service impact, estimated simulated downtime, recovery effort, affected services, dan safety constraints.

**FR-SIM-04 — Reproducible run (P0)**  
Setiap run memiliki ID, input/configuration snapshot, simulator version, timestamp, dan status. Jika terdapat randomisasi, seed dicatat.

**FR-SIM-05 — Comparison (P0)**  
Pengguna dapat membandingkan hasil kandidat pada skema metrik yang sama.

**FR-SIM-06 — Deterministic safety validation (P0)**  
Safety policy dievaluasi oleh kode deterministik dan tidak dapat dilewati oleh narasi AI.

**FR-SIM-07 — Human review (P0)**  
Hasil rekomendasi memerlukan review manusia. Status review tidak mengeksekusi tindakan nyata.

**FR-SIM-08 — Honest execution state (P0)**  
UI hanya menampilkan run completed setelah menerima status sukses dari backend. Run gagal, parsial, atau dibatalkan harus ditandai secara benar.

**FR-SIM-09 — Reset scenario (P1)**  
Pengguna dapat mengembalikan konfigurasi skenario ke baseline.

**FR-SIM-10 — Simulation disclaimer (P0)**  
Tampilkan: “Results are simulated estimates, not guarantees of real-world outcomes.”

### 6.7 AI Recommendations

**FR-AI-01 — Evidence-grounded explanation (P0)**  
Penjelasan merujuk pada evidence IDs yang valid dan output simulasi yang tersedia.

**FR-AI-02 — Structured response (P0)**  
Output AI divalidasi terhadap skema yang didefinisikan sebelum ditampilkan.

**FR-AI-03 — Explain trade-offs (P0)**  
Rekomendasi mencakup manfaat, risiko, operational impact, asumsi, uncertainty, alternatif yang ditolak, dan safety validation.

**FR-AI-04 — Confidence semantics (P0)**  
Confidence score tidak boleh disebut probabilitas terkalibrasi kecuali sudah diuji kalibrasinya.

**FR-AI-05 — Provider failure (P0)**  
Timeout, rate limit, malformed response, atau provider outage ditangani dengan status yang jelas. Core simulator harus tetap dapat digunakan tanpa AI.

**FR-AI-06 — Human review states (P0)**  
Dukung `Pending Review`, `Approved for Demonstration`, `Rejected`, dan `Requires More Evidence`.

**FR-AI-07 — No policy override (P0)**  
AI tidak boleh mengubah hasil safety engine, angka simulasi, atau status validasi deterministik.

### 6.8 Experiments and evaluation

**FR-EXP-01 — Experiment configuration (P0)**  
Pengguna dapat memilih dataset/skenario sintetis dan metode pembanding yang tersedia.

**FR-EXP-02 — Baselines (P0)**  
Bandingkan:
A. Rule-based immediate response.  
B. AI recommendation without impact simulation.  
C. Simulation with deterministic safety constraints.

**FR-EXP-03 — Metrics (P0)**  
Metrik yang direncanakan:
- Scenario mitigation success rate.
- Safety constraint violations.
- Simulated service downtime.
- Agreement with predefined expected outcomes.
- Median decision time.
- Number of scenarios evaluated.

Setiap metrik harus memiliki definisi, unit, denominator, dan prosedur perhitungan. Metrik yang belum dapat diukur harus dinonaktifkan atau diberi label belum tersedia.

**FR-EXP-04 — Run metadata (P0)**  
Catat run ID, konfigurasi, timestamps, dataset version, simulator version, dan hasil.

**FR-EXP-05 — No fabricated benchmark (P0)**  
Sebelum eksperimen dijalankan, tampilkan `No experiment run yet` atau empty state yang setara.

**FR-EXP-06 — Reproducibility (P0)**  
Pengguna atau evaluator dapat memeriksa konfigurasi yang menghasilkan hasil tertentu.

**FR-EXP-07 — Export (P1)**  
Ekspor CSV jika hasil tabel tersedia. Ekspor harus menghasilkan file valid.

### 6.9 Reports

**FR-REP-01 — Report types (P1)**  
Dukung laporan insiden, perbandingan simulasi, evaluasi eksperimen, dan ringkasan audit.

**FR-REP-02 — Report provenance (P0)**  
Laporan memuat run ID, timestamp, konfigurasi, evidence reviewed, strategi, safety evaluation, hasil, dan keterbatasan.

**FR-REP-03 — Export integrity (P1)**  
PDF/CSV hanya boleh ditawarkan sebagai aksi berhasil jika file benar-benar dihasilkan.

**FR-REP-04 — Preview (P1)**  
Pengguna dapat meninjau isi laporan sebelum ekspor.

### 6.10 Audit trail

**FR-AUD-01 — Event recording (P0)**  
Catat event penting seperti login/logout bila sesuai kebijakan, simulation run created/completed/failed, review decision, report export, dan perubahan setting yang relevan.

**FR-AUD-02 — Traceability (P0)**  
Event memiliki timestamp, actor, event type, related resource, summary, result, dan correlation/run ID jika relevan.

**FR-AUD-03 — Honest immutability claim (P0)**  
Jangan menyebut audit log immutable atau tamper-proof tanpa mekanisme dan pengujian yang membuktikannya.

### 6.11 Settings, profile, notifications

**FR-SET-01 — Settings status (P1)**  
Pengaturan harus disimpan dan berlaku jika ditampilkan sebagai aktif. Setting yang belum diimplementasikan harus dinyatakan sebagai prototype/unavailable.

**FR-PRO-01 — Profile (P1)**  
Pengguna dapat melihat dan mengubah field profil yang memang didukung backend.

**FR-NOT-01 — Notifications (P1)**  
Tampilkan notifikasi yang berasal dari event sistem nyata atau event demo yang dilabeli jelas. Status read/unread harus persisten bila diklaim persisten.

---

## 7. Data dan Contoh Dataset

Semua data berikut adalah contoh sintetis untuk konsistensi demo, bukan data insiden nyata.

### 7.1 Contoh incident

- Incident ID: `INC-2026-0042`
- Title: `Suspicious Privilege Escalation`
- Environment: `Simulation Lab`
- Severity: `High`
- Illustrative confidence score: `0.82`
- Affected asset: `APP-GW-02`
- Related identity: `analyst-demo-03`
- Status: `Awaiting Review`

Score `0.82` hanya nilai ilustratif sampai definisi dan kalibrasinya dibuktikan.

### 7.2 Contoh virtual assets

- `IDENTITY-SVC-01`
- `APP-GW-02`
- `MONITOR-01`
- `OPS-DASH-01`
- `OT-CONTROLLER-SIM-01`
- `TELEMETRY-SIM-01`

Nama aset harus konsisten di topology, incident detail, simulator, recommendations, experiments, dan reports.

### 7.3 Entitas data konseptual

Skema akhir ditetapkan di `ARSITEKTUR.md` setelah stack diputuskan. Entitas yang mungkin dibutuhkan:

- `User`
- `Session`
- `Incident`
- `EvidenceEvent`
- `VirtualAsset`
- `AssetDependency`
- `Scenario`
- `ScenarioVersion`
- `SimulationRun`
- `StrategyEvaluation`
- `SafetyPolicy`
- `SafetyEvaluation`
- `Recommendation`
- `ReviewDecision`
- `Experiment`
- `ExperimentResult`
- `Report`
- `AuditEvent`
- `Notification`

Jangan membuat tabel tanpa kebutuhan domain yang jelas. Relasi, constraint, index, dan lifecycle harus dijelaskan sebelum migrasi dibuat.

---

## 8. Rekomendasi Technology Stack

Bagian ini adalah rekomendasi produk/arsitektur, bukan pernyataan bahwa stack sudah dipilih atau tersedia. Keputusan final harus mempertimbangkan akses repository, environment Antigravity, versi runtime yang tersedia, serta kompatibilitas dependency.

### 8.1 Frontend

| Area | Rekomendasi | Alasan |
|---|---|---|
| Framework | Next.js App Router + React | Routing, server rendering untuk public pages, ekosistem matang, dan struktur aplikasi yang jelas |
| Language | TypeScript strict mode | Mengurangi kesalahan kontrak dan meningkatkan maintainability |
| Styling | Tailwind CSS | Design tokens dan layout konsisten serta iterasi visual cepat |
| Components | shadcn/ui + Radix primitives | Komponen dapat dimiliki dan disesuaikan di repository; aksesibilitas menjadi fondasi |
| Icons | Lucide | Konsisten dan ringan |
| Form validation | React Hook Form + Zod | Validasi dan tipe form terstruktur |
| Server-state | TanStack Query bila diperlukan | Caching, loading, error, invalidation, dan API state yang terpisah dari UI |
| Charts | Library React yang dipilih setelah kebutuhan chart diperiksa | Hindari memasang banyak library grafik yang tumpang tindih |
| Graph | React Flow atau library graph sebanding | Node/edge interaktif untuk virtual topology |
| Motion | Motion for React (keluarga Framer Motion) | Transisi UI dan interaksi komponen |
| Timeline/scroll animation | GSAP secara selektif | Animasi editorial pada landing page atau visualisasi terpilih |
| 3D | Three.js melalui React Three Fiber, hanya jika memberi nilai | Untuk visualisasi 3D yang benar-benar dibutuhkan, bukan dekorasi |
| Testing | Vitest + React Testing Library + Playwright | Unit/component tests dan end-to-end browser workflows |

**Prinsip penggunaan animasi:** Motion/Framer Motion dan GSAP tidak harus digunakan bersamaan di setiap komponen. Pilih satu pemilik animasi untuk setiap elemen agar tidak terjadi konflik lifecycle, performa buruk, atau animasi berlebihan. Three.js tidak boleh menjadi alasan membuat seluruh dashboard menjadi 3D. Untuk topologi layanan, graph 2D biasanya lebih mudah dibaca dan diuji.

Tailwind dan shadcn/ui harus mengikuti desain Figma. Jangan membiarkan default template shadcn menentukan ulang identitas visual.

### 8.2 Backend

| Area | Rekomendasi | Alasan |
|---|---|---|
| Runtime/language | Python modern, versi stabil yang kompatibel dengan dependency | Cocok untuk simulasi, evaluasi, dan integrasi AI |
| API framework | FastAPI | API berbasis ASGI, type hints, OpenAPI, dan dukungan validasi |
| Schema validation | Pydantic | Kontrak request/response dan validasi data |
| ORM | SQLAlchemy 2.x | Data access terstruktur dan dukungan async bila diperlukan |
| Migrations | Alembic | Perubahan skema database dapat ditelusuri |
| Database | PostgreSQL | Relational integrity, transaksi, dan pertumbuhan data yang lebih baik untuk deployment multi-user |
| Testing | Pytest + HTTPX/TestClient | Pengujian service, API, dan aturan domain |
| Logging | Structured logging | Traceability untuk request, run, dan kegagalan |
| API contract | OpenAPI + schema tests | Frontend dan backend memiliki kontrak yang jelas |

Gunakan operasi async bila I/O memang asynchronous dan driver/library mendukungnya. Jangan menganggap semua fungsi harus async; pekerjaan CPU-bound tetap perlu strategi yang sesuai.

### 8.3 Background jobs dan cache

Untuk MVP, jalankan simulasi secara langsung jika durasinya singkat dan terukur.

Tambahkan Redis dan worker queue hanya jika ada kebutuhan nyata seperti:
- eksperimen batch,
- simulasi panjang,
- job retry,
- concurrency control,
- atau pemrosesan di luar request lifecycle.

Jika dibutuhkan, evaluasi task queue Python yang sesuai, misalnya ARQ atau Celery, berdasarkan reliability, retry semantics, monitoring, dan kompleksitas operasional. Jangan memasang Redis hanya karena dianggap wajib untuk aplikasi modern.

### 8.4 Authentication

Gunakan autentikasi server-backed dengan:
- password hashing yang aman, misalnya Argon2id melalui library teruji;
- session yang dapat dicabut;
- cookie HttpOnly dan Secure pada HTTPS;
- SameSite dan CSRF protection yang sesuai;
- rate limiting untuk endpoint sensitif;
- password reset token yang kedaluwarsa;
- validasi server-side;
- audit event untuk tindakan akun yang relevan.

Karena Next.js dan FastAPI merupakan dua aplikasi, desain alur session/cookie, CORS, CSRF, dan origin harus dijelaskan secara eksplisit. Jangan mencampur mekanisme JWT, cookie session, dan local storage tanpa model ancaman yang jelas.

### 8.5 Deployment

Target awal:
- Development lokal yang dapat dijalankan dengan instruksi yang jelas.
- Environment variables untuk konfigurasi.
- PostgreSQL untuk deployment.
- Containerization jika sesuai kebutuhan environment.
- Health/readiness checks.
- Database migrations yang eksplisit.
- CI untuk lint, type-check, test, dan build.
- Secret management di luar source code.

Platform deployment final dipilih setelah batasan hackathon, biaya, dan environment diketahui.

### 8.6 Keputusan stack

Rekomendasi awal untuk dievaluasi adalah **Next.js + TypeScript + Tailwind CSS + shadcn/ui untuk frontend, serta FastAPI + Pydantic + SQLAlchemy + PostgreSQL untuk backend**.

Ini bukan stack yang otomatis paling cepat dalam semua kondisi. Keputusan akhir harus mempertimbangkan kemampuan tim, kompatibilitas dependency, deployment, dan waktu implementasi. Hindari microservices pada MVP. Satu frontend dan satu backend modular sudah cukup.

---

## 9. Non-Functional Requirements

### 9.1 Maintainability

- Domain logic tidak ditempatkan langsung di UI components atau route handlers.
- API contract memiliki skema yang eksplisit.
- Shared components tidak diduplikasi tanpa alasan.
- Gunakan TypeScript strict mode dan typing Python yang sesuai.
- Konfigurasi terpisah dari source code.
- Setiap modul memiliki tanggung jawab yang jelas.
- Hindari abstraksi generik sebelum ada kebutuhan nyata.
- Setiap keputusan arsitektur penting dicatat dalam ADR.
- Dokumentasi harus sesuai dengan implementasi aktual.

### 9.2 Performance

Target awal yang perlu diuji, bukan dijamin:

- Public landing page berusaha mencapai Core Web Vitals yang baik pada perangkat dan koneksi representatif.
- Hindari memuat Three.js pada route yang tidak membutuhkannya.
- Gunakan dynamic imports untuk visualisasi berat.
- Optimalkan image assets dan font loading.
- Gunakan pagination untuk tabel yang berkembang.
- Hindari mengambil semua log sekaligus.
- Gunakan caching hanya bila invalidation dan data freshness jelas.
- Tetapkan timeout untuk API dan AI provider.
- Ukur performa sebelum melakukan optimasi spekulatif.

### 9.3 Reliability

- API mengembalikan error schema yang konsisten.
- Simulation run memiliki status yang jelas: queued/running/completed/failed/cancelled sesuai kebutuhan implementasi.
- Kegagalan AI tidak menggagalkan safety validation.
- Data run yang gagal tidak boleh ditampilkan sebagai hasil sukses.
- Migrasi database dapat dijalankan secara terkontrol.
- Backup/restore ditentukan untuk environment yang menyimpan data penting.

### 9.4 Security and privacy

- Least privilege.
- Validasi input server-side.
- Proteksi terhadap SQL injection melalui query parameterization/ORM yang tepat.
- Proteksi XSS melalui escaping dan sanitization sesuai konteks.
- CORS dibatasi pada origin yang diperlukan.
- CSRF protection sesuai model cookie/session.
- Rate limiting untuk endpoint sensitif.
- Secrets tidak dikomit.
- Jangan memasukkan credential ke prompt atau log.
- Batasi ukuran request dan upload.
- Hindari menyimpan personal data yang tidak dibutuhkan.
- Jangan kirim data akun atau secret ke AI provider.
- Gunakan dependency scanning yang sesuai.
- Dokumentasikan batas keamanan prototype.

### 9.5 Accessibility

- Semantic HTML.
- Keyboard navigation untuk alur utama.
- Focus indicator terlihat.
- Label form eksplisit.
- Contrast yang memadai.
- Status tidak bergantung pada warna saja.
- Reduced-motion support.
- Error messages yang dapat dibaca screen reader.
- Graph harus memiliki alternatif tekstual atau daftar aset/dependensi yang dapat diakses.

### 9.6 Observability

- Structured logs.
- Request/correlation ID.
- Simulation run ID.
- Error context tanpa secret.
- Durasi request dan simulasi.
- AI provider latency dan failure count bila integrasi aktif.
- Health check yang tidak membocorkan informasi sensitif.

### 9.7 Responsive design

Target layout:
- Desktop: 1440 px.
- Tablet: 1024 px.
- Mobile: 390 px.

Tidak boleh ada clipped content atau horizontal page overflow yang tidak disengaja. Tabel dapat menggunakan responsive card view atau horizontal scrolling terkontrol jika memang diperlukan.

---

## 10. UX, Visual Design, dan Anti-AI-Slop Standards

### 10.1 Design tokens

Pertahankan token dari `DESIGN.md`:

- Background primary: `#171717`
- Background secondary: `#202020`
- Card surface: `#252525`
- Elevated surface: `#2C2C2C`
- Input surface: `#1D1D1D`
- Default border: `#383838`
- Subtle border: `#303030`
- Primary text: `#F5F5F5`
- Secondary text: `#A3A3A3`
- Muted text: `#737373`
- Orange accent: `#FF6B35`
- Orange hover: `#FF8255`
- Orange soft: `#42271F`
- Success: `#4ADE80`
- Warning: `#FBBF24`
- Critical: `#F87171`
- Information: `#60A5FA`

Font utama: Inter. Spacing menggunakan basis 8 px dengan 4 px untuk micro-spacing. Radius standar: 8 px untuk compact controls, 12 px untuk cards/inputs, dan 16 px untuk panel/dialog besar.

### 10.2 Hierarki visual

- Landing page dapat menggunakan headline besar dan editorial spacing.
- Dashboard harus mengutamakan scanning, alignment, dan keterbacaan data.
- Data table/log harus padat tetapi tetap terbaca.
- Orange digunakan untuk primary actions, selected states, dan highlight terpilih.
- Jangan memberi semua kartu warna, shadow, dan visual prominence yang sama.
- Tampilkan informasi teknis lanjutan melalui detail drawer, tab, atau disclosure yang jelas.

### 10.3 Motion principles

Gunakan animasi untuk menjelaskan perubahan state, orientasi, atau hierarki.

- Micro-interaction: cepat dan halus.
- Page transition: hanya jika meningkatkan orientasi pengguna.
- GSAP: untuk sequence atau scroll animation terpilih di public site, bukan setiap elemen.
- Motion for React: transisi komponen dan state UI.
- Three.js: hanya untuk visualisasi 3D yang benar-benar membantu pemahaman.
- Hormati `prefers-reduced-motion`.
- Hindari animasi yang menunda tugas operasional atau mengganggu pembacaan data.

### 10.4 Anti-AI-slop acceptance rules

Dilarang:
- Template dashboard generik yang tidak mencerminkan alur simulator.
- Gradient ungu/biru sebagai identitas utama.
- Neon border pada semua kartu.
- Glassmorphism berlebihan.
- Matrix rain, hooded hacker photos, atau dekorasi sci-fi.
- Angka performa palsu.
- Logo partner/pelanggan fiktif.
- Lorem ipsum.
- Tombol tanpa fungsi.
- Banyak kartu yang mengulang informasi sama.
- Animasi yang hanya menjadi dekorasi.
- Layout berbeda-beda tanpa alasan antarhalaman.
- Komponen yang dibuat ulang padahal sudah tersedia.
- Menambahkan Three.js hanya untuk membuat UI terlihat “canggih”.

Setiap keputusan visual harus mendukung pemahaman, alur kerja, atau identitas produk.

---

## 11. Data Flow dan Aturan Domain

### 11.1 Alur utama

`Synthetic Evidence → Incident Analysis → Candidate Strategies → Deterministic Simulation → Safety Policy Evaluation → AI Explanation → Human Review → Experiment/Report/Audit`

### 11.2 Pemisahan tanggung jawab

- **Evidence service:** menyajikan fakta sintetis dan evidence references.
- **Incident service:** mengelola konteks insiden.
- **Topology service:** mengelola aset virtual dan dependensi.
- **Simulation engine:** menghitung hasil simulasi berdasarkan input dan model yang terdokumentasi.
- **Safety policy engine:** mengevaluasi aturan keselamatan secara deterministik.
- **AI adapter:** menjelaskan evidence dan output yang sudah tervalidasi.
- **Review service:** mencatat keputusan manusia.
- **Experiment service:** menyimpan konfigurasi dan hasil evaluasi.
- **Report service:** membangun laporan dari data yang tersimpan.
- **Audit service:** mencatat event penting.

AI adapter tidak boleh menjadi tempat perhitungan metrik authoritative atau pengambilan keputusan safety policy.

### 11.3 Validasi topology

- Semua edge harus merujuk pada node yang ada.
- Jenis dependency harus terdokumentasi.
- Cycle harus ditolak atau ditangani secara eksplisit sesuai model domain.
- Perubahan topology untuk sebuah simulasi tidak boleh merusak baseline.
- Hasil run harus mengacu pada topology/scenario version yang dipakai saat run dilakukan.

### 11.4 Reproducibility

Setiap simulation run harus menyimpan informasi yang cukup untuk memahami dan mengulang perhitungan:
- scenario ID dan version;
- topology version atau snapshot;
- candidate strategy configuration;
- simulator version;
- policy version;
- random seed bila relevan;
- input hash bila sesuai;
- timestamp;
- hasil per strategi;
- status;
- error summary bila gagal.

Jangan menyimpan secret atau personal data di snapshot simulasi.

---

## 12. API Requirements

Kontrak akhir mengikuti `ARSITEKTUR.md` dan keputusan stack. Contoh route berikut bersifat usulan awal, bukan kontrak implementasi yang sudah tersedia.

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/api/v1/incidents` | List/filter incidents |
| `GET` | `/api/v1/incidents/{id}` | Incident detail |
| `GET` | `/api/v1/incidents/{id}/evidence` | Evidence terkait insiden |
| `GET` | `/api/v1/assets` | Virtual assets |
| `GET` | `/api/v1/topology` | Topology baseline |
| `GET` | `/api/v1/scenarios` | Available synthetic scenarios |
| `POST` | `/api/v1/simulation-runs` | Create/run simulation |
| `GET` | `/api/v1/simulation-runs/{id}` | Run details and status |
| `GET` | `/api/v1/simulation-runs/{id}/comparison` | Strategy comparison |
| `GET` | `/api/v1/recommendations` | List recommendations |
| `POST` | `/api/v1/recommendations/{id}/review` | Record review outcome |
| `GET` | `/api/v1/experiments` | List experiments |
| `POST` | `/api/v1/experiments` | Create experiment |
| `GET` | `/api/v1/experiments/{id}` | Experiment results |
| `GET` | `/api/v1/reports/{id}` | Report preview/data |
| `GET` | `/api/v1/audit-events` | Query audit events |

API requirements:
- Versioned prefix.
- Typed request/response schemas.
- Pagination and filtering contract.
- Consistent error schema.
- Input validation.
- Authentication and authorization.
- Timeouts and request limits.
- No internal stack traces in public responses.
- OpenAPI contract checked in tests.
- Do not implement every endpoint before confirming the page workflows and data requirements.

---

## 13. Acceptance Criteria

MVP dianggap memenuhi target apabila seluruh kriteria P0 berikut telah diverifikasi.

### Product and UX
- [ ] Seluruh halaman P0 tersedia sesuai route inventory.
- [ ] Landing page mengikuti desain Figma dan berfungsi di desktop/mobile.
- [ ] Login dan signup terhubung ke backend yang nyata.
- [ ] Route aplikasi terlindungi oleh autentikasi server-side.
- [ ] Shared navigation dan breadcrumb berfungsi.
- [ ] Semua primary buttons memiliki aksi yang jelas.
- [ ] Loading, empty, error, dan success states tersedia pada alur utama.
- [ ] Data sintetis konsisten di semua halaman.
- [ ] UI menampilkan `SIMULATION ONLY` dan disclaimer simulasi.
- [ ] Tidak ada klaim data real-time, benchmark, atau integrasi produksi yang palsu.

### Simulation and safety
- [ ] Minimal satu skenario sintetis end-to-end dapat dijalankan.
- [ ] Minimal tiga kandidat strategi dapat dibandingkan.
- [ ] Output simulator memiliki definisi metrik yang terdokumentasi.
- [ ] Safety constraints diuji secara deterministik.
- [ ] AI tidak dapat mengubah hasil safety engine.
- [ ] Hasil gagal tidak ditampilkan sebagai sukses.
- [ ] Run menyimpan konfigurasi dan versi yang dibutuhkan untuk traceability.
- [ ] Human review tercatat sebagai workflow simulatif.

### Engineering
- [ ] Database migrations dapat dijalankan dari lingkungan bersih.
- [ ] Environment variables dan setup instructions terdokumentasi.
- [ ] Unit tests untuk simulation engine dan safety policy lulus.
- [ ] API integration tests utama lulus.
- [ ] Lint dan type checks lulus.
- [ ] Production build berhasil.
- [ ] Tidak ada secret di repository.
- [ ] Error responses tidak membocorkan informasi sensitif.
- [ ] Tidak ada route atau tombol utama yang mati.
- [ ] Batasan dan fitur yang belum tersedia tercatat.

Kriteria yang belum diverifikasi harus tetap ditandai belum selesai. Checklist bukan pengganti bukti pengujian.

---

## 14. Testing Strategy

### 14.1 Unit tests

- Validasi scenario schema.
- Dependency graph validation.
- Impact calculation.
- Candidate strategy evaluation.
- Safety policy rules.
- Metric calculation.
- Evidence reference validation.
- AI output schema validation.
- Report data transformation.

### 14.2 Integration tests

- Database migrations.
- Incident-to-evidence relationships.
- Simulation run persistence.
- Safety evaluation persistence.
- Recommendation review state.
- Experiment result persistence.
- Audit event creation.
- Authentication and authorization.
- Error mapping.

### 14.3 End-to-end tests

1. Landing page → Sign Up → Login.
2. Login → Onboarding → Dashboard.
3. Dashboard → Incident List → Incident Detail.
4. Incident Detail → Evidence Timeline.
5. Incident Detail → Response Simulator.
6. Run Simulation → Compare Strategies → Inspect Explanation.
7. Digital Twin → Select Asset → Inspect Impact.
8. Recommendation → Record Review → Audit Trail.
9. Experiments → Results → Report Preview/Export.
10. Profile → Settings → Logout.

### 14.4 Visual and responsive tests

- Desktop: 1440 px.
- Tablet: 1024 px.
- Mobile: 390 px.
- Periksa clipping, overflow, table behavior, graph readability, menu, form states, dan focus states.
- Bandingkan browser screenshots dengan frame Figma yang sesuai bila tooling tersedia.

### 14.5 Security tests

- Unauthorized access ke `/app/*`.
- Invalid/expired reset token.
- Rate limiting endpoint sensitif.
- Input validation dan batas request.
- CORS dan CSRF sesuai arsitektur.
- Secret leakage dalam response/log.
- Pengguna tidak dapat mengakses data pengguna lain jika data ownership berlaku.

---

## 15. Roadmap Implementasi

### Phase 0 — Audit dan design handoff
- Periksa repository, file ekspor Figma, `DESIGN.md`, `ARSITEKTUR.md`, dan `SKILLS.md`.
- Buat route inventory dan design-to-code mapping.
- Tetapkan stack berdasarkan hasil audit.
- Catat asumsi dan pertanyaan terbuka.

**Exit criteria:** stack decision terdokumentasi; aset desain dan halaman terinventarisasi; tidak ada perubahan besar tanpa audit.

### Phase 1 — Foundation
- Setup monorepo atau struktur repository yang dipilih.
- Setup lint, type checks, tests, environment variables, dan scripts.
- Buat design tokens dan shared components.
- Buat public layout, auth layout, app shell, route skeletons.
- Siapkan API schema dan database migration baseline.

**Exit criteria:** aplikasi dapat dijalankan lokal; route dasar tersedia; CI checks dasar berfungsi.

### Phase 2 — Public website dan auth
- Implementasi landing page dan public routes.
- Implementasi server-backed authentication.
- Implementasi protected routes.
- Implementasi onboarding.
- Validasi responsive design.

**Exit criteria:** public-to-auth workflow berhasil diuji.

### Phase 3 — Core investigation UI
- Implementasi incident list/detail.
- Implementasi evidence/timeline.
- Implementasi topology baseline.
- Hubungkan UI dengan API dan dataset sintetis.

**Exit criteria:** pengguna dapat menelusuri satu insiden dari dashboard ke evidence.

### Phase 4 — Simulation engine
- Implementasi domain models.
- Implementasi dependency impact model.
- Implementasi candidate strategies.
- Implementasi deterministic safety engine.
- Implementasi run persistence dan comparison.
- Tulis unit/integration tests.

**Exit criteria:** satu skenario dapat dijalankan dan dibandingkan secara reproducible.

### Phase 5 — AI explanation dan human review
- Implementasi AI adapter.
- Validasi structured output.
- Evidence-grounded explanation.
- Human review states.
- Provider failure/fallback handling.

**Exit criteria:** rekomendasi menjelaskan hasil yang benar-benar ada dan AI tidak dapat override safety rules.

### Phase 6 — Experiments, reports, audit
- Implementasi experiment runs dan baseline comparison.
- Implementasi report preview/export.
- Implementasi audit trail.
- Pastikan hasil terukur dibedakan dari illustrative values.

**Exit criteria:** evaluator dapat memeriksa run, hasil, keputusan review, dan laporan.

### Phase 7 — Hardening and demo readiness
- Visual review terhadap Figma.
- Responsive/accessibility review.
- Security review.
- Test, lint, type-check, build.
- Setup documentation.
- Known limitations.
- Demo script dan seed data.

**Exit criteria:** semua P0 acceptance criteria memiliki bukti verifikasi atau secara eksplisit dicatat sebagai blocker.

---

## 16. Risks and Mitigations

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Stack terlalu kompleks untuk waktu hackathon | Fitur inti tidak selesai | Gunakan modular monolith; hindari microservices |
| UI tidak sesuai Figma | Produk terlihat generik | Design-to-code mapping dan visual review |
| Animasi berlebihan | Performa turun dan data sulit dibaca | Motion hanya saat memberi nilai; reduced-motion support |
| Three.js menambah beban tanpa manfaat | Bundle besar dan kompleksitas | Gunakan hanya untuk use case yang jelas; topology utama bisa 2D |
| AI menghasilkan klaim palsu | Rekomendasi menyesatkan | Structured output, evidence references, validation, fallback |
| AI provider tidak tersedia | Demo terganggu | Core simulator tetap bekerja tanpa AI |
| Safety rule bergantung pada AI | Batas keselamatan tidak dapat dipercaya | Deterministic safety engine dengan tests |
| Metrik tidak didefinisikan | Evaluasi tidak valid | Definisikan rumus, denominator, unit, dan baseline |
| Data demo tidak konsisten | UI kehilangan kredibilitas | Single source of truth untuk synthetic dataset |
| Auth hanya mock | Risiko keamanan | Server-backed authentication dan route authorization |
| Scope melebar | MVP tidak selesai | Prioritaskan P0; tangguhkan P2 |
| Desain file tidak dapat diakses | Implementasi berdasarkan tebakan | Gunakan ekspor Figma yang tersedia; catat gap |
| Deployment environment berbeda | Build/demo gagal | Pin dependency, environment example, reproducible setup |

---

## 17. Definition of Ready dan Definition of Done

### Definition of Ready

Sebuah fitur siap dikerjakan jika:
- Tujuan pengguna jelas.
- Route atau area UI diketahui.
- Data input/output didefinisikan.
- Acceptance criteria tersedia.
- Safety implications diperiksa.
- Dependency dan blocker diketahui.
- Figma reference tersedia atau gap didokumentasikan.

### Definition of Done

Sebuah fitur selesai jika:
- Implementasi sesuai acceptance criteria.
- UI mengikuti design system.
- Loading, empty, error, dan success states yang relevan tersedia.
- Input divalidasi.
- Otorisasi diperiksa pada server jika diperlukan.
- Tests relevan ditambahkan dan dijalankan.
- Tidak ada placeholder yang disamarkan sebagai integrasi nyata.
- Dokumentasi/status diperbarui.
- Perubahan dapat direview dan dijalankan oleh pengembang lain.

---

## 18. Dokumentasi dan Struktur Project

Struktur akhir mengikuti stack yang dipilih. Hindari memaksakan struktur ini jika repository sudah memiliki konvensi yang baik.

Contoh konseptual:

```text
garda-sim-ai/
├── apps/
│   ├── web/                    # Next.js frontend
│   └── api/                    # FastAPI backend
├── packages/
│   └── contracts/              # Shared API schemas/types, if appropriate
├── docs/
│   ├── PRD.md
│   ├── DESIGN.md
│   ├── ARSITEKTUR.md
│   ├── API.md
│   ├── DATA_MODEL.md
│   ├── SECURITY.md
│   ├── ADR/
│   └── IMPLEMENTATION_STATUS.md
├── infra/
│   └── local development configuration
├── .env.example
├── README.md
└── ...
```

Ini hanya contoh, bukan instruksi untuk memindahkan file tanpa audit.

Dokumen yang perlu dipelihara:
- `PRD.md`: kebutuhan dan scope produk.
- `DESIGN.md`: UI/UX, design tokens, komponen, responsive rules.
- `ARSITEKTUR.md`: arsitektur, modul, data flow, database, API, keamanan.
- `SKILLS.md`: standar kerja agent/developer.
- `API.md`: kontrak API.
- `DATA_MODEL.md`: entitas dan relasi.
- `SECURITY.md`: threat model dan batas keamanan prototype.
- `ADR/`: keputusan arsitektur penting.
- `IMPLEMENTATION_STATUS.md`: status yang diverifikasi.
- `README.md`: cara setup, menjalankan, testing, dan build.

---

## 19. Open Questions yang Harus Diselesaikan

Sebelum keputusan final:
1. Apakah desain Figma telah diekspor sebagai screenshot, SVG/PNG, atau source code?
2. Apakah ada repository Git yang sudah dibuat?
3. Apakah aplikasi hanya demo lokal atau akan dipublikasikan?
4. Apakah email verification wajib untuk MVP, atau cukup development mode?
5. Apakah AI provider/API key sudah tersedia, atau MVP harus sepenuhnya dapat berjalan tanpa provider?
6. Apakah simulasi akan berjalan sinkron atau membutuhkan background worker?
7. Apakah ada batasan platform, biaya, atau persyaratan khusus dari Kartika Cyber Hackathon?
8. Apakah perlu akun multi-user atau satu akun demo cukup untuk demonstrasi awal?

Jika jawaban belum tersedia, tandai sebagai asumsi dan pilih default yang paling sederhana serta aman. Jangan menunda pekerjaan independen yang tidak bergantung pada pertanyaan tersebut.

---

## 20. Final Product Statement

GARDA-SIM AI adalah prototipe web defensif yang membantu operator menilai alternatif respons insiden melalui simulasi dan penjelasan yang dapat ditelusuri. Nilai produk terletak pada integrasi evidence-grounded analysis, virtual service dependencies, deterministic impact/safety evaluation, reproducible experiments, dan human review.

Kualitas produk tidak diukur dari banyaknya animasi, jumlah kartu dashboard, atau penggunaan framework yang sedang populer. Kualitas diukur dari koherensi alur, kejelasan data, keandalan logika simulasi, transparansi batasan, keamanan implementasi, konsistensi desain, dan kemampuan hasilnya untuk diuji.

**Final instruction for the implementation agent:** Treat this PRD as the product requirements baseline, `DESIGN.md` as the visual source of truth, and `ARSITEKTUR.md` as the initial architecture reference. Audit the actual repository and exported Figma assets before implementation. If the documents conflict, record the conflict and resolve it explicitly instead of silently inventing a new product direction.
