import {
    tambahTugas,
    hapusTugas,
    editTugas,
    toggleSelesai
} from "./tugas.js";

import {
    tambahCatatan,
    hapusCatatan,
    editCatatan
} from "./catatan.js";

import {
    simpan,
    muat
} from "./storage.js";

import {
    ambilKutipan,
    ambilCuaca
} from "./api.js";

console.log("DailyBoard siap dijalankan!");

const app = document.getElementById("app");

app.innerHTML = `
<h2>Selamat datang di DailyBoard!</h2>

<p id="status">Memuat data...</p>

<section>
    <button id="toggle-tema">Dark Mode</button>
    <input id="cari-tugas" placeholder="Cari tugas...">
</section>

<section>
    <h3>Tugas</h3>

    <input id="input-tugas" placeholder="Nama tugas">
    <button id="tambah-tugas">Tambah</button>

    <div>
        <button id="semua">Semua</button>
        <button id="selesai">Selesai</button>
        <button id="belum">Belum Selesai</button>
    </div>

    <ul id="daftar-tugas"></ul>
</section>

<section>
    <h3>Catatan</h3>

    <textarea id="input-catatan"
        placeholder="Tulis catatan..."></textarea>

    <button id="tambah-catatan">
        Tambah Catatan
    </button>

    <div id="daftar-catatan"></div>
</section>

<section>
    <h3>Kutipan Hari Ini</h3>

    <p id="kutipan">Memuat kutipan...</p>

    <button id="refresh-kutipan">
        Refresh Kutipan
    </button>
</section>

<section>
    <h3>Cuaca</h3>

    <form id="form-cuaca">
        <input id="input-kota" placeholder="Nama kota">
        <button>Cek Cuaca</button>
    </form>

    <p id="info-cuaca">Memuat cuaca...</p>
</section>
`;

let daftarTugas = muat("daftarTugas", [
    {
        id: 1,
        nama: "Belajar JavaScript",
        selesai: false
    },
    {
        id: 2,
        nama: "Olahraga Pagi",
        selesai: false
    }
]);

let daftarCatatan = muat("catatanData", []);

const list =
    document.getElementById("daftar-tugas");

const inputTugas =
    document.getElementById("input-tugas");

const inputCatatan =
    document.getElementById("input-catatan");

const daftarCatatanBox =
    document.getElementById("daftar-catatan");

function validasi(nilai) {

    if (!nilai.trim()) {

        alert("Input tidak boleh kosong!");

        return false;
    }

    if (nilai.length > 100) {

        alert("Maksimal 100 karakter!");

        return false;
    }

    return true;
}

function renderTugas(data = daftarTugas) {

    list.innerHTML = "";

    data.forEach(tugas => {

        const li = document.createElement("li");

        li.className = "tugas-item";
        li.dataset.id = tugas.id;

        if (tugas.selesai) {

            li.style.textDecoration =
                "line-through";
        }

        li.innerHTML = `
            <span>${tugas.nama}</span>
            <button>Hapus</button>
        `;

        li.querySelector("span").onclick = () => {

            daftarTugas =
                toggleSelesai(
                    daftarTugas,
                    tugas.id
                );

            simpan(
                "daftarTugas",
                daftarTugas
            );

            renderTugas();
        };

        li.querySelector("span").ondblclick = () => {

            const nama = prompt(
                "Edit tugas:",
                tugas.nama
            );

            if (
                nama !== null &&
                validasi(nama)
            ) {

                daftarTugas =
                    editTugas(
                        daftarTugas,
                        tugas.id,
                        nama.trim()
                    );

                simpan(
                    "daftarTugas",
                    daftarTugas
                );

                renderTugas();
            }
        };

        li.querySelector("button").onclick = () => {

            daftarTugas =
                hapusTugas(
                    daftarTugas,
                    tugas.id
                );

            simpan(
                "daftarTugas",
                daftarTugas
            );

            renderTugas();
        };

        list.appendChild(li);
    });
}

document.getElementById("tambah-tugas").onclick = () => {

    const nama =
        inputTugas.value.trim();

    if (!validasi(nama)) return;

    daftarTugas =
        tambahTugas(
            daftarTugas,
            nama
        );

    simpan(
        "daftarTugas",
        daftarTugas
    );

    inputTugas.value = "";

    renderTugas();
};

inputTugas.onkeydown = e => {

    if (e.key === "Enter") {

        document
            .getElementById("tambah-tugas")
            .click();
    }
};

document.getElementById("semua").onclick =
    () => renderTugas();

document.getElementById("selesai").onclick =
    () => renderTugas(
        daftarTugas.filter(
            t => t.selesai
        )
    );

document.getElementById("belum").onclick =
    () => renderTugas(
        daftarTugas.filter(
            t => !t.selesai
        )
    );

function debounce(fn, delay = 300) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(
            () => fn(...args),
            delay
        );
    };
}

const cariTugas = debounce(kata => {

    const hasil =
        daftarTugas.filter(t =>
            t.nama
                .toLowerCase()
                .includes(kata)
        );

    renderTugas(hasil);

}, 300);

document.getElementById("cari-tugas").oninput =
    e => {

        cariTugas(
            e.target.value.toLowerCase()
        );
    };

function renderCatatan() {

    daftarCatatanBox.innerHTML = "";

    daftarCatatan.forEach(catatan => {

        const div =
            document.createElement("div");

        div.className =
            "kartu-catatan";

        div.innerHTML = `
            <p>${catatan.isi}</p>
            <small>${catatan.tanggal}</small>
            <button>Hapus</button>
        `;

        div.querySelector("p").ondblclick = () => {

            const isi = prompt(
                "Edit catatan:",
                catatan.isi
            );

            if (
                isi !== null &&
                validasi(isi)
            ) {

                daftarCatatan =
                    editCatatan(
                        daftarCatatan,
                        catatan.id,
                        isi.trim()
                    );

                simpan(
                    "catatanData",
                    daftarCatatan
                );

                renderCatatan();
            }
        };
      
        div.querySelector("button").onclick = () => {

            daftarCatatan =
                hapusCatatan(
                    daftarCatatan,
                    catatan.id
                );

            simpan(
                "catatanData",
                daftarCatatan
            );

            renderCatatan();
        };

        daftarCatatanBox.appendChild(div);
    });
}

// Tambah catatan
document.getElementById("tambah-catatan").onclick = () => {

    const isi =
        inputCatatan.value.trim();

    if (!validasi(isi)) return;

    daftarCatatan =
        tambahCatatan(
            daftarCatatan,
            isi
        );

    simpan(
        "catatanData",
        daftarCatatan
    );

    inputCatatan.value = "";

    renderCatatan();
};

const toggleTema =
    document.getElementById("toggle-tema");

function muatTema() {

    if (
        localStorage.getItem("tema") ===
        "gelap"
    ) {

        document.body.classList.add(
            "dark-mode"
        );

        toggleTema.textContent =
            "Light Mode";
    }
}

toggleTema.onclick = () => {

    document.body.classList.toggle(
        "dark-mode"
    );

    const gelap =
        document.body.classList.contains(
            "dark-mode"
        );

    localStorage.setItem(
        "tema",
        gelap
            ? "gelap"
            : "terang"
    );

    toggleTema.textContent =
        gelap
            ? "Light Mode"
            : "Dark Mode";
};

async function tampilkanKutipan() {

    const box =
        document.getElementById("kutipan");

    try {

        box.textContent =
            "Memuat...";

        box.textContent =
            await ambilKutipan();

    } catch {

        box.textContent =
            "Gagal memuat kutipan.";

        throw new Error(
            "Gagal memuat kutipan"
        );
    }
}

document
    .getElementById("refresh-kutipan")
    .onclick =
    tampilkanKutipan;

document.getElementById("form-cuaca").onsubmit =
    async e => {

        e.preventDefault();

        const kota =
            document.getElementById(
                "input-kota"
            ).value.trim();

        if (!kota) return;

        const box =
            document.getElementById(
                "info-cuaca"
            );

        try {

            box.textContent =
                "Memuat...";

            box.textContent =
                await ambilCuaca(kota);

        } catch (error) {

            box.textContent =
                error.message;
        }
    };

async function jalankanAplikasi() {

    const status =
        document.getElementById("status");

    try {

        muatTema();

        renderTugas();

        renderCatatan();

        await tampilkanKutipan();

        const dataCuaca =
            await ambilCuaca("Jakarta");

        document.getElementById(
            "info-cuaca"
        ).textContent = dataCuaca;

        status.textContent =
            "Data berhasil dimuat";

        console.log(
            "Semua modul DailyBoard berhasil dimuat!"
        );

    } catch (error) {

        status.textContent =
            "Data gagal dimuat";

        console.error(
            "Data gagal dimuat:",
            error
        );
    }
}

jalankanAplikasi();