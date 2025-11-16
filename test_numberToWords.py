#!/usr/bin/env python3
"""
Script de test pour comparer numberToWords.js avec num2words (Python)
Teste 10 000 nombres aléatoires entre 0 et 100 000 (entiers et décimaux)
"""

import random
import json
import subprocess
from num2words import num2words
from typing import Tuple, List

def format_currency_in_words_python(amount: float, currency_singular: str = 'euro', 
                                   currency_plural: str = 'euros', lang: str = 'fr') -> str:
    """
    Convertit un montant en mots (version Python - identique à Flask)
    """
    integer_part = int(amount)
    decimal_part = int(round((amount - integer_part) * 100))

    # Déterminer la forme correcte de la devise
    if integer_part == 1 or integer_part == 0 or integer_part == -1:
        currency_word = currency_singular
    else:
        currency_word = currency_plural

    words = num2words(integer_part, lang=lang) + f" {currency_word}"
    if decimal_part > 0:
        words += " et " + num2words(decimal_part, lang=lang) + " centimes"
    
    return words.capitalize()

def test_js_number_conversion(number: float) -> str:
    """
    Teste la fonction JavaScript numberToWords en utilisant Node.js
    """
    js_code = f"""
    // Charger le module numberToWords
    {open('/Users/yacine/Documents/projets_code_random/calculs_pc/app_statique/numberToWords.js').read()}
    
    // Tester avec le nombre
    const amount = {number};
    const integerPart = Math.floor(amount);
    const decimalPart = Math.round((amount - integerPart) * 100);
    
    let currencyWord;
    if (integerPart === 0 || integerPart === 1 || integerPart === -1) {{
        currencyWord = 'euro';
    }} else {{
        currencyWord = 'euros';
    }}
    
    let words = numberToWords(integerPart) + ' ' + currencyWord;
    
    if (decimalPart > 0) {{
        words += ' et ' + numberToWords(decimalPart) + ' centimes';
    }}
    
    // Mettre la première lettre en majuscule
    words = words.charAt(0).toUpperCase() + words.slice(1);
    
    console.log(words);
    """
    
    try:
        result = subprocess.run(
            ['node', '-e', js_code],
            capture_output=True,
            text=True,
            timeout=5
        )
        return result.stdout.strip()
    except subprocess.TimeoutExpired:
        return "TIMEOUT"
    except Exception as e:
        return f"ERROR: {str(e)}"

def generate_test_numbers(count: int = 10000, max_value: int = 100000) -> List[float]:
    """
    Génère une liste de nombres aléatoires pour les tests
    """
    numbers = []
    
    # Ajouter des cas particuliers importants
    special_cases = [
        0, 1, 2, 10, 11, 17, 20, 21, 30, 45, 
        70, 71, 72, 80, 81, 90, 91, 99, 
        100, 200, 201, 450, 500, 1000, 1001, 2000, 
        10000, 50000, 99999, 100000
    ]
    
    # Ajouter les cas spéciaux avec des décimales
    for num in special_cases:
        if num <= max_value:
            numbers.append(float(num))
            # Ajouter aussi avec des centimes aléatoires
            if len(numbers) < count:
                numbers.append(num + random.randint(1, 99) / 100)
    
    # Compléter avec des nombres aléatoires
    while len(numbers) < count:
        # Nombre entier aléatoire
        if random.random() < 0.5:
            numbers.append(float(random.randint(0, max_value)))
        else:
            # Nombre décimal aléatoire
            integer_part = random.randint(0, max_value)
            decimal_part = random.randint(0, 99)
            numbers.append(integer_part + decimal_part / 100)
    
    return numbers[:count]

def run_tests(num_tests: int = 10000, max_value: int = 100000, verbose: bool = False):
    """
    Lance les tests et compare les résultats
    """
    print("=" * 80)
    print("TEST DE COMPARAISON : numberToWords.js vs num2words (Python)")
    print("=" * 80)
    print(f"\nGénération de {num_tests} nombres de test...")
    
    test_numbers = generate_test_numbers(num_tests, max_value)
    
    print(f"Tests générés : {len(test_numbers)} nombres")
    print(f"Plage : 0 à {max_value}")
    print("Types : entiers et décimaux\n")
    
    print("Démarrage des tests...")
    print("-" * 80)
    
    passed = 0
    failed = 0
    errors = 0
    failures_list = []
    
    for i, number in enumerate(test_numbers):
        if (i + 1) % 100 == 0:
            print(f"Progression : {i + 1}/{num_tests} tests effectués...", end='\r')
        
        # Obtenir le résultat Python
        try:
            python_result = format_currency_in_words_python(number)
        except Exception as e:
            print(f"\nErreur Python pour {number}: {e}")
            errors += 1
            continue
        
        # Obtenir le résultat JavaScript
        js_result = test_js_number_conversion(number)
        
        if js_result.startswith("ERROR") or js_result == "TIMEOUT":
            if verbose:
                print(f"\n❌ Erreur JS pour {number}: {js_result}")
            errors += 1
            failures_list.append({
                'number': number,
                'python': python_result,
                'javascript': js_result,
                'type': 'error'
            })
        elif python_result == js_result:
            passed += 1
            if verbose:
                print(f"\n✅ {number} → {python_result}")
        else:
            failed += 1
            if verbose or failed <= 20:  # Afficher les 20 premières erreurs
                print(f"\n❌ DIFFÉRENCE pour {number}:")
                print(f"   Python : {python_result}")
                print(f"   JS     : {js_result}")
            failures_list.append({
                'number': number,
                'python': python_result,
                'javascript': js_result,
                'type': 'mismatch'
            })
    
    # Résultats finaux
    print("\n" + "=" * 80)
    print("RÉSULTATS DES TESTS")
    print("=" * 80)
    print(f"\n✅ Tests réussis : {passed}/{num_tests} ({passed/num_tests*100:.2f}%)")
    print(f"❌ Tests échoués : {failed}/{num_tests} ({failed/num_tests*100:.2f}%)")
    print(f"⚠️  Erreurs       : {errors}/{num_tests} ({errors/num_tests*100:.2f}%)")
    
    # Afficher un résumé des échecs
    if failures_list and len(failures_list) <= 50:
        print("\n" + "-" * 80)
        print("DÉTAILS DES ÉCHECS :")
        print("-" * 80)
        for failure in failures_list[:20]:  # Limiter à 20 pour la lisibilité
            print(f"\n{failure['number']} :")
            print(f"  Python : {failure['python']}")
            print(f"  JS     : {failure['javascript']}")
    
    # Sauvegarder tous les échecs dans un fichier JSON
    if failures_list:
        with open('/Users/yacine/Documents/projets_code_random/calculs_pc/app_statique/test_failures.json', 'w', encoding='utf-8') as f:
            json.dump(failures_list, f, indent=2, ensure_ascii=False)
        print("\n📝 Tous les échecs ont été sauvegardés dans : test_failures.json")
    
    print("\n" + "=" * 80)
    
    if passed == num_tests:
        print("🎉 SUCCÈS TOTAL ! Tous les tests sont passés !")
    elif failed == 0 and errors > 0:
        print("⚠️  Quelques erreurs d'exécution, mais aucune différence de résultat")
    elif failed > 0:
        print("⚠️  Des différences ont été détectées. Voir les détails ci-dessus.")
    
    print("=" * 80)
    
    return passed, failed, errors

def quick_test():
    """
    Test rapide sur quelques nombres clés
    """
    print("\n" + "=" * 80)
    print("TEST RAPIDE - Nombres clés")
    print("=" * 80 + "\n")
    
    test_cases = [
        0, 1, 2, 10, 17, 20, 21, 30, 45,
        70, 71, 72, 80, 81, 90, 91, 99,
        100, 200, 450, 450.50, 1000, 2500.75, 10000
    ]
    
    for number in test_cases:
        python_result = format_currency_in_words_python(number)
        js_result = test_js_number_conversion(number)
        
        match = "✅" if python_result == js_result else "❌"
        print(f"{match} {number}")
        print(f"   Python : {python_result}")
        print(f"   JS     : {js_result}")
        if python_result != js_result:
            print("   DIFFÉRENCE DÉTECTÉE!")
        print()

if __name__ == "__main__":
    import sys
    
    # Vérifier que Node.js est installé
    try:
        subprocess.run(['node', '--version'], capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ ERREUR : Node.js n'est pas installé ou n'est pas dans le PATH")
        print("   Installez Node.js depuis https://nodejs.org/")
        sys.exit(1)
    
    # Vérifier que num2words est installé
    try:
        from num2words import num2words
    except ImportError:
        print("❌ ERREUR : num2words n'est pas installé")
        print("   Installez-le avec : pip install num2words")
        sys.exit(1)
    
    print("\n🚀 Environnement vérifié : Node.js et num2words sont disponibles\n")
    
    # Choisir le type de test
    if len(sys.argv) > 1 and sys.argv[1] == "--quick":
        quick_test()
    else:
        # Test complet
        verbose = "--verbose" in sys.argv or "-v" in sys.argv
        num_tests = 10000
        
        if "--count" in sys.argv:
            idx = sys.argv.index("--count")
            if idx + 1 < len(sys.argv):
                try:
                    num_tests = int(sys.argv[idx + 1])
                except ValueError:
                    print("⚠️  Nombre de tests invalide, utilisation de 10000 par défaut")
        
        passed, failed, errors = run_tests(num_tests=num_tests, verbose=verbose)
        
        # Code de sortie
        if failed == 0 and errors == 0:
            sys.exit(0)
        else:
            sys.exit(1)

