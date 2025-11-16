// Variables globales pour stocker les données
let appData = {
    studyName: '',
    numPhases: 0,
    phases: []
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du formulaire de configuration
    document.getElementById('configForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        appData.studyName = document.getElementById('study_name').value;
        appData.numPhases = parseInt(document.getElementById('num_phases').value);
        
        showPage('page2');
        generatePhasesInputs();
    });
    
    // Gestion du formulaire de détails
    document.getElementById('detailsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        collectPhasesData();
        calculateAndDisplayResults();
        showPage('page3');
    });
});

// Afficher une page spécifique
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Générer les champs de saisie pour les phases
function generatePhasesInputs() {
    document.getElementById('study_name_display').textContent = appData.studyName;
    
    const tbody = document.getElementById('phasesTableBody');
    tbody.innerHTML = '';
    
    for (let i = 1; i <= appData.numPhases; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Phase ${i}</td>
            <td><input type="number" name="jeh_phase_${i}" min="0" required></td>
            <td><input type="number" name="prix_jeh_phase_${i}" step="0.01" value="450.00" required></td>
        `;
        tbody.appendChild(row);
    }
}

// Collecter les données des phases
function collectPhasesData() {
    appData.phases = [];
    
    for (let i = 1; i <= appData.numPhases; i++) {
        const jeh = parseInt(document.querySelector(`input[name="jeh_phase_${i}"]`).value);
        const prixJeh = parseFloat(document.querySelector(`input[name="prix_jeh_phase_${i}"]`).value);
        
        appData.phases.push({
            id: i,
            jeh: jeh,
            prixJeh: prixJeh
        });
    }
    
    appData.fraisType = document.getElementById('frais_type').value;
    appData.fraisValue = parseFloat(document.getElementById('frais_value').value);
    appData.tauxTva = parseFloat(document.getElementById('taux_tva').value);
    appData.pourcentageAcompte = parseFloat(document.getElementById('pourcentage_acompte').value);
}

// Calculer et afficher les résultats
function calculateAndDisplayResults() {
    // Afficher le nom de l'étude
    document.getElementById('results_study_name').textContent = appData.studyName;
    
    // Générer le tableau des phases
    const resultsTableBody = document.getElementById('resultsTableBody');
    resultsTableBody.innerHTML = '';
    
    let totalJehGlobal = 0;
    let prestationHtGlobal = 0;
    
    appData.phases.forEach(phase => {
        const prixHtPhase = phase.jeh * phase.prixJeh;
        totalJehGlobal += phase.jeh;
        prestationHtGlobal += prixHtPhase;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Phase ${phase.id}</td>
            <td>${phase.jeh}</td>
            <td>${formatCurrency(phase.prixJeh)}</td>
            <td>${formatCurrency(prixHtPhase)}</td>
        `;
        resultsTableBody.appendChild(row);
    });
    
    // Afficher les totaux de prestation
    document.getElementById('total_jeh_global').textContent = totalJehGlobal;
    document.getElementById('prestation_ht_global').textContent = formatCurrency(prestationHtGlobal);
    document.getElementById('prestation_ht_global_words').textContent = formatCurrencyInWords(prestationHtGlobal);
    
    // Calculer les frais
    let fraisHtCalculated = 0;
    if (appData.fraisType === 'percentage') {
        fraisHtCalculated = prestationHtGlobal * (appData.fraisValue / 100);
        document.getElementById('frais_display').innerHTML = `<strong>Frais HT (${formatNumber(appData.fraisValue)}% de ${formatCurrency(prestationHtGlobal)}) :</strong> ${formatCurrency(fraisHtCalculated)} €`;
    } else {
        fraisHtCalculated = appData.fraisValue;
        document.getElementById('frais_display').innerHTML = `<strong>Frais HT :</strong> ${formatCurrency(fraisHtCalculated)} €`;
    }
    document.getElementById('frais_ht_words').textContent = formatCurrencyInWords(fraisHtCalculated);
    
    // Calculer le total HT
    const totalHt = prestationHtGlobal + fraisHtCalculated;
    document.getElementById('total_ht').textContent = formatCurrency(totalHt);
    document.getElementById('total_ht_words').textContent = formatCurrencyInWords(totalHt);
    
    // Calculer la TVA
    const tvaAmount = totalHt * (appData.tauxTva / 100);
    document.getElementById('taux_tva_display').textContent = formatNumber(appData.tauxTva);
    document.getElementById('tva_amount').textContent = formatCurrency(tvaAmount);
    document.getElementById('tva_amount_words').textContent = formatCurrencyInWords(tvaAmount);
    
    // Calculer le total TTC
    const totalTtc = totalHt + tvaAmount;
    document.getElementById('total_ttc').textContent = formatCurrency(totalTtc);
    document.getElementById('total_ttc_words').textContent = formatCurrencyInWords(totalTtc);
    
    // Calculer l'acompte
    const acompteFraisHt = fraisHtCalculated;
    const acomptePrestationHt = prestationHtGlobal * (appData.pourcentageAcompte / 100);
    const acompteMontantHt = acompteFraisHt + acomptePrestationHt;
    const acompteTvaAmount = acompteMontantHt * (appData.tauxTva / 100);
    const acompteMontantTtc = acompteMontantHt + acompteTvaAmount;
    
    document.getElementById('pourcentage_acompte_display').textContent = Math.round(appData.pourcentageAcompte);
    document.getElementById('acompte_frais_ht').textContent = formatCurrency(acompteFraisHt);
    document.getElementById('acompte_prestation_ht').textContent = formatCurrency(acomptePrestationHt);
    document.getElementById('acompte_montant_ht').textContent = formatCurrency(acompteMontantHt);
    document.getElementById('acompte_tva_amount').textContent = formatCurrency(acompteTvaAmount);
    document.getElementById('acompte_montant_ttc').textContent = formatCurrency(acompteMontantTtc);
    
    // Calculer le solde
    const soldeFraisHt = 0.00;
    const soldePrestationHt = prestationHtGlobal - acomptePrestationHt;
    const soldeMontantHt = soldeFraisHt + soldePrestationHt;
    const soldeTvaAmount = soldeMontantHt * (appData.tauxTva / 100);
    const soldeMontantTtc = soldeMontantHt + soldeTvaAmount;
    
    document.getElementById('solde_frais_ht').textContent = formatCurrency(soldeFraisHt);
    document.getElementById('solde_prestation_ht').textContent = formatCurrency(soldePrestationHt);
    document.getElementById('solde_montant_ht').textContent = formatCurrency(soldeMontantHt);
    document.getElementById('solde_tva_amount').textContent = formatCurrency(soldeTvaAmount);
    document.getElementById('solde_montant_ttc').textContent = formatCurrency(soldeMontantTtc);
}

// Formater un nombre en devise (2 décimales avec virgule)
function formatCurrency(amount) {
    return amount.toFixed(2).replace('.', ',');
}

// Formater un nombre avec 2 décimales (avec virgule)
function formatNumber(num) {
    return num.toFixed(2).replace('.', ',');
}

// Convertir un montant en lettres
function formatCurrencyInWords(amount) {
    const integerPart = Math.floor(amount);
    const decimalPart = Math.round((amount - integerPart) * 100);
    
    // Déterminer la forme correcte de la devise
    let currencyWord;
    if (integerPart === 0 || integerPart === 1 || integerPart === -1) {
        currencyWord = 'euro';
    } else {
        currencyWord = 'euros';
    }
    
    let words = numberToWords(integerPart) + ' ' + currencyWord;
    
    if (decimalPart > 0) {
        words += ' et ' + numberToWords(decimalPart) + ' centimes';
    }
    
    // Mettre la première lettre en majuscule
    return words.charAt(0).toUpperCase() + words.slice(1);
}

// Réinitialiser l'application
function resetApp() {
    appData = {
        studyName: '',
        numPhases: 0,
        phases: []
    };
    
    document.getElementById('configForm').reset();
    document.getElementById('detailsForm').reset();
    
    showPage('page1');
}

