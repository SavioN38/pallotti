$ErrorActionPreference = 'Stop'
$galleryRoot = 'd:\Pallotti_Hill_Public_School_Website\public\images\gallery'
$jsonPath = 'd:\Pallotti_Hill_Public_School_Website\gallery_download_urls.json'

$swTotal = [System.Diagnostics.Stopwatch]::StartNew()
$web = New-Object System.Net.WebClient
$web.Headers.Add('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36')
$web.Headers.Add('Referer', 'https://www.pallottihillmukkam.org/gallery-2025-2026/')

Write-Host ''
Write-Host ('Reading URL map from: ' + $jsonPath)
$jsonRaw = Get-Content -Raw -Path $jsonPath
$data = $jsonRaw | ConvertFrom-Json

$grandTotal = 0
foreach ($prop in $data.PSObject.Properties) { $grandTotal += $prop.Value.Count }

$catsCount = $data.PSObject.Properties.Count
Write-Host ('Found ' + $catsCount + ' categories, ' + $grandTotal + ' images total.')
Write-Host ('Target root: ' + $galleryRoot)
Write-Host ''

$total = 0
$success = 0
$exists = 0
$failed = 0
$totalBytes = [long]0
$failList = New-Object System.Collections.Generic.List[string]
$perCat = New-Object System.Collections.Generic.List[object]

foreach ($prop in $data.PSObject.Properties) {
    $cat = $prop.Name
    $urls = $prop.Value
    $safeCat = ($cat -replace '[<>:"/\\|?*]', '_')
    $folder = Join-Path $galleryRoot $safeCat
    New-Item -ItemType Directory -Force -Path $folder | Out-Null

    $catDone = 0
    $catFail = 0
    $catBytes = [long]0
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
                    $catDone++
                    $totalBytes += $fi.Length
                    $catBytes += $fi.Length
                    $statusLine = '[' + $cat + '] ' + $i + '/' + $urls.Count + ' EXIST - total ' + $total + '/' + $grandTotal + ' ok:' + $success + ' exist:' + $exists + ' fail:' + $failed
                    Write-Progress -Activity 'Gallery download' -Status $statusLine -PercentComplete ([int]($total / $grandTotal * 100))
                    Start-Sleep -Milliseconds 6
                    continue
                }
            }

            $web.DownloadFile($url, $fullPath)
            $fi2 = Get-Item $fullPath
            $success++
            $catDone++
            $totalBytes += $fi2.Length
            $catBytes += $fi2.Length
            $statusLine = '[' + $cat + '] ' + $i + '/' + $urls.Count + ' NEW   - total ' + $total + '/' + $grandTotal + ' ok:' + $success + ' exist:' + $exists + ' fail:' + $failed
            Write-Progress -Activity 'Gallery download' -Status $statusLine -PercentComplete ([int]($total / $grandTotal * 100))
            Start-Sleep -Milliseconds 18
        }
        catch {
            $failed++
            $catFail++
            $msg = '[' + $cat + '] ' + $url + '  ::  ' + $_.Exception.Message
            $failList.Add($msg)
            $statusLine = '[' + $cat + '] ' + $i + '/' + $urls.Count + ' FAIL  - total ' + $total + '/' + $grandTotal + ' ok:' + $success + ' exist:' + $exists + ' fail:' + $failed
            Write-Progress -Activity 'Gallery download' -Status $statusLine -PercentComplete ([int]($total / $grandTotal * 100))
            Start-Sleep -Milliseconds 250
        }
    }

    $row = New-Object PSObject -Property @{
        Category = $cat
        Done     = $catDone
        Fail     = $catFail
        SizeMB   = [Math]::Round($catBytes / 1MB, 2)
    }
    $perCat.Add($row)
    Start-Sleep -Milliseconds 200
}

$swTotal.Stop()
$e = $swTotal.Elapsed
$elapsedLine = '  Elapsed:        ' + $e.Hours.ToString('00') + ':' + $e.Minutes.ToString('00') + ':' + $e.Seconds.ToString('00') + '.' + $e.Milliseconds.ToString('000')
$sizeMBText = [Math]::Round($totalBytes / 1MB, 1).ToString('N1')
$filesCount = $success + $exists
$sizeLine = '  Total size:     ' + $sizeMBText + ' MB   (' + $filesCount.ToString('N0') + ' files on disk)'

Write-Host ''
Write-Host '====================  FINAL SUMMARY  ====================' -ForegroundColor Cyan
Write-Host $elapsedLine
Write-Host ('  Total URLs:     ' + $grandTotal)
Write-Host ('  Downloaded:     ' + $success + '   (new)') -ForegroundColor Green
Write-Host ('  Already exist:  ' + $exists + '   (skipped)') -ForegroundColor Yellow
$failColor = if ($failed -gt 0) { 'Red' } else { 'Green' }
Write-Host ('  Failed:         ' + $failed) -ForegroundColor $failColor
Write-Host $sizeLine
Write-Host ('  Saved in:       ' + $galleryRoot)
Write-Host '==========================================================' -ForegroundColor Cyan
Write-Host ''
Write-Host 'PER-CATEGORY BREAKDOWN:'
$perCat | Select-Object Category, Done, Fail, SizeMB | Format-Table -AutoSize | Out-String | Write-Host
Write-Host ''
if ($failList.Count -gt 0) {
    Write-Host ('FAILURES (' + $failList.Count + '):') -ForegroundColor Red
    foreach ($f in $failList) { Write-Host ('  ' + $f) -ForegroundColor Red }
    Write-Host ''
}
Write-Host 'DONE. Ready to build the gallery page!' -ForegroundColor Green
