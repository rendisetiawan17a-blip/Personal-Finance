let db = JSON.parse(localStorage.getItem('finance_report')) || [];
let mode = 'income';

const listElement = document.getElementById('transaction-list');
const balanceText = document.getElementById('balance-text');

function updateDashboard() {
    listElement.innerHTML = '';
    let balance = 0, totalIn = 0, totalOut = 0;

    db.forEach((item, index) => {
        const amount = parseInt(item.amount);
        if (item.type === 'income') {
            balance += amount;
            totalIn += amount;
        } else {
            balance -= amount;
            totalOut += amount;
        }

        listElement.innerHTML += `
            <div class="item-card animate-in">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm 
                        ${item.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}">
                        ${item.type === 'income' ? '↙' : '↗'}
                    </div>
                    <div>
                        <p class="text-xs font-bold text-gray-800">${item.desc}</p>
                        <p class="text-[9px] font-bold text-gray-300 uppercase">${item.date}</p>
                    </div>
                </div>
                <p class="text-sm font-black ${item.type === 'income' ? 'text-green-500' : 'text-gray-800'}">
                    ${item.type === 'income' ? '+' : '-'} Rp ${amount.toLocaleString()}
                </p>
            </div>
        `;
    });

    balanceText.innerText = `Rp ${balance.toLocaleString()}`;
    document.getElementById('total-in').innerText = `+ Rp ${totalIn.toLocaleString()}`;
    document.getElementById('total-out').innerText = `- Rp ${totalOut.toLocaleString()}`;
    
    localStorage.setItem('finance_report', JSON.stringify(db));
}

function toggleModal(m = 'income') {
    mode = m;
    document.getElementById('modal-title').innerText = m === 'income' ? 'Pemasukan Baru' : 'Pengeluaran Baru';
    document.getElementById('modal').classList.toggle('hidden');
}

function saveData() {
    const desc = document.getElementById('desc').value;
    const amount = document.getElementById('amount').value;
    
    // LOGIKA TANGGAL OTOMATIS
    const sekarang = new Date();
    const opsi = { day: '2-digit', month: 'short' }; // Hasilnya: 25 Des
    const tanggalOtomatis = sekarang.toLocaleDateString('id-ID', opsi);

    if (!desc || !amount) {
        alert("Waduh, isi dulu keterangan dan jumlahnya ya!");
        return;
    }

    // Masukkan ke database (termasuk tanggal otomatis)
    db.push({ 
        desc: desc, 
        amount: amount, 
        type: mode, 
        date: tanggalOtomatis // Ini yang otomatis tersimpan
    });
    
    // Reset Form & Update Tampilan
    document.getElementById('desc').value = '';
    document.getElementById('amount').value = '';
    toggleModal();
    updateDashboard();
}

function clearAll() {
    if (confirm("Hapus semua riwayat?")) {
        db = [];
        updateDashboard();
    }
}

// Jalankan saat pertama buka
updateDashboard();