$ErrorActionPreference = 'Stop'
$galleryRoot = 'd:\Pallotti_Hill_Public_School_Website\public\images\gallery-2024-25'
$jsonPath = 'd:\Pallotti_Hill_Public_School_Website\gallery_2024_2025_urls_clean.json'

$swTotal = [System.Diagnostics.Stopwatch]::StartNew()
$web = New-Object System.Net.WebClient
$web.Headers.Add('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36')
$web.Headers.Add('Referer', 'https://www.pallottihillmukkam.org/gallery-2024-2025/')

Write-Host ''
Write-Host ('Reading clean URL map from: ' + $jsonPath)
$jsonRaw = Get-Content -Raw -Path $jsonPath
$data = $jsonRaw | ConvertFrom-Json

$grandTotal = 0
foreach ($prop in $data.PSObject.Properties) { $grandTotal += $prop.Value.Count }

$catsCount = $data.PSObject.Properties.Count
Write-Host ('Found ' + $catsCount + ' categories, ' + $grandTotal + ' full-res images total.')
Write-Host ('Target root: ' + $galleryRoot)
Write-Host ''

$total = 0
$success = 0
$exists = 0
$failed = 0
$totalBytes = [long]0
$failList = New-Object System.Collections.Generic.List[string]

foreach ($prop in $data.PSObject.Properties) {
    $cat = $prop.Name
    $urls = $prop.Value
    $safeCat = ($cat -replace '[<>:"/\\|?*]', '_')
    $folder = Join-Path $galleryRoot $safeCat
    New-Item -ItemType Directory -Force -Path $folder | Out-Null

    $i = 0
    foreach ($url in $urls) {
        $i++
        $total++
        try {
            $cleanUrl = ($url -split '\?')[0]
            $ext = [System.IO.Path]::GetExtension($cleanUrl)
            if ([string]::IsNullOrEmpty($ext)) { $ext = '.jpg' }
            $baseName = [System.IO.Path]::GetFileNameWithoutExtension($cleanUrl)
            if ([string]::IsNullOrEmpty($baseName) -or $baseName.Length -gt 80) {
                $prefix = if ($safeCat.Length -gt 20) { $safeCat.Substring(0, 20) } else { $safeCat }
                $baseName = $prefix + '_' + $i.ToString('000')
            }
            $fileName = $baseName + $ext
            $fullPath = Join-Path $folder $fileName

            if (Test-Path $fullPath) {
                $fi = Get-Item $fullPath
                if ($fi.Length -gt 0) {
                    $exists++
                    $totalBytes += $fi.Length
                    continue
                }
            }

            $web.DownloadFile($url, $fullPath)
            $fi2 = Get-Item $fullPath
            $success++
            $totalBytes += $fi2.Length
            Write-Host ('[' + $total + '/' + $grandTotal + '] Downloaded: ' + $safeCat + '/' + $fileName) -ForegroundColor Green
        }
        catch {
            $failed++
            $failList.Add($url)
            Write-Host ('[' + $total + '/' + $grandTotal + '] Failed: ' + $url) -ForegroundColor Red
        }
    }
}

$swTotal.Stop()
Write-Host ''
Write-Host '====================  CLEAN DOWNLOAD COMPLETE  ====================' -ForegroundColor Cyan
Write-Host ('Downloaded: ' + $success + ' | Exists: ' + $exists + ' | Failed: ' + $failed)
Write-Host ('Saved in: ' + $galleryRoot)
