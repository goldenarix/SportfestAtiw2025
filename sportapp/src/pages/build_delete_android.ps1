# Pfad zum zu löschenden Ordner
$folderPath = "C:\Users\adria\OneDrive\MeineApp\PadersportApp2\sportapp\android\app\build"

# Überprüfen, ob das Skript mit Administratorrechten ausgeführt wird
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(`
    [Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "Starte Skript mit Administratorrechten neu..."
    Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

# Überprüfen, ob der Ordner existiert
if (Test-Path $folderPath) {
    try {
        # Ordner löschen
        Remove-Item -Path $folderPath -Recurse -Force
        Write-Host "Ordner erfolgreich gelöscht: $folderPath"
    } catch {
        Write-Error "Fehler beim Löschen des Ordners: $_"
    }
} else {
    Write-Host "Ordner nicht gefunden: $folderPath"
}

# Skript beenden