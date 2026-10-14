Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ARUNKUMAR\.gemini\antigravity\brain\1fd37e69-caea-453a-8b7a-86afe8733d34\.user_uploaded\media_1791968698348.jpg"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

function Save-ResizedSquare {
    param (
        [System.Drawing.Bitmap]$Source,
        [int]$Size,
        [string]$DestPath,
        [bool]$Round = $false
    )

    $dest = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    if ($Round) {
        $g.Clear([System.Drawing.Color]::Transparent)
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $path.AddEllipse(0, 0, $Size, $Size)
        $g.SetClip($path)
    } else {
        $g.Clear([System.Drawing.Color]::Black)
    }

    $g.DrawImage($Source, 0, 0, $Size, $Size)

    $parent = Split-Path -Parent $DestPath
    if (-not (Test-Path $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }

    $dest.Save($DestPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $dest.Dispose()
    if ($Round) { $path.Dispose() }
}

function Save-AdaptiveForeground {
    param (
        [System.Drawing.Bitmap]$Source,
        [int]$Size,
        [string]$DestPath
    )

    $dest = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $g.Clear([System.Drawing.Color]::Transparent)

    # Safe zone in 108dp is 72dp (66.6%).
    # We fit the 1024x1024 image into ~82% of $Size so the heart & glowing rings stay beautifully inside the mask
    $drawSize = [int]($Size * 0.84)
    $offset = [int](($Size - $drawSize) / 2.0)

    # Draw rounded or soft circular mask so foreground blends smoothly
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $cornerRadius = [int]($drawSize * 0.28)
    $rect = New-Object System.Drawing.Rectangle $offset, $offset, $drawSize, $drawSize
    
    # Draw image
    $g.DrawImage($Source, $rect)

    $parent = Split-Path -Parent $DestPath
    if (-not (Test-Path $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }

    $dest.Save($DestPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $dest.Dispose()
}

function Save-Splash {
    param (
        [System.Drawing.Bitmap]$Source,
        [int]$Width,
        [int]$Height,
        [string]$DestPath
    )

    $dest = New-Object System.Drawing.Bitmap $Width, $Height
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Background color: dark twilight #120914
    $bg = [System.Drawing.Color]::FromArgb(255, 18, 9, 20)
    $g.Clear($bg)

    # Size heart to ~45% of min dimension
    $minDim = [Math]::Min($Width, $Height)
    $targetHeartSize = [int]($minDim * 0.58)
    $targetHeartSize = [Math]::Max($targetHeartSize, 180)
    if ($targetHeartSize -gt $minDim) { $targetHeartSize = [int]($minDim * 0.85) }

    $x = [int](($Width - $targetHeartSize) / 2.0)
    $y = [int](($Height - $targetHeartSize) / 2.0)

    # Soft circular clip for splash icon
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse($x, $y, $targetHeartSize, $targetHeartSize)
    
    # Draw subtle glow behind splash heart
    for ($i = 5; $i -ge 1; $i--) {
        $glowSize = $targetHeartSize + ($i * 12)
        $gx = [int](($Width - $glowSize) / 2.0)
        $gy = [int](($Height - $glowSize) / 2.0)
        $glowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(15, 255, 42, 95))
        $g.FillEllipse($glowBrush, $gx, $gy, $glowSize, $glowSize)
        $glowBrush.Dispose()
    }

    $g.SetClip($path)
    $g.DrawImage($Source, $x, $y, $targetHeartSize, $targetHeartSize)
    $g.ResetClip()
    $path.Dispose()

    $parent = Split-Path -Parent $DestPath
    if (-not (Test-Path $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }

    $dest.Save($DestPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $dest.Dispose()
}

Write-Host "Generating web and public icons..."
Save-ResizedSquare -Source $src -Size 512 -DestPath "frontend/public/icon.png"
Save-ResizedSquare -Source $src -Size 512 -DestPath "frontend/public/logo.png"
Save-ResizedSquare -Source $src -Size 512 -DestPath "frontend/public/soulsync-logo.png"
Copy-Item $srcPath "frontend/public/app-icon.jpg" -Force

Write-Host "Generating Android launcher mipmap icons..."
# mdpi
Save-ResizedSquare -Source $src -Size 48 -DestPath "frontend/android/app/src/main/res/mipmap-mdpi/ic_launcher.png"
Save-ResizedSquare -Source $src -Size 48 -DestPath "frontend/android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png" -Round $true
Save-AdaptiveForeground -Source $src -Size 108 -DestPath "frontend/android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png"

# hdpi
Save-ResizedSquare -Source $src -Size 72 -DestPath "frontend/android/app/src/main/res/mipmap-hdpi/ic_launcher.png"
Save-ResizedSquare -Source $src -Size 72 -DestPath "frontend/android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png" -Round $true
Save-AdaptiveForeground -Source $src -Size 162 -DestPath "frontend/android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png"

# xhdpi
Save-ResizedSquare -Source $src -Size 96 -DestPath "frontend/android/app/src/main/res/mipmap-xhdpi/ic_launcher.png"
Save-ResizedSquare -Source $src -Size 96 -DestPath "frontend/android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png" -Round $true
Save-AdaptiveForeground -Source $src -Size 216 -DestPath "frontend/android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png"

# xxhdpi
Save-ResizedSquare -Source $src -Size 144 -DestPath "frontend/android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png"
Save-ResizedSquare -Source $src -Size 144 -DestPath "frontend/android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png" -Round $true
Save-AdaptiveForeground -Source $src -Size 324 -DestPath "frontend/android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png"

# xxxhdpi
Save-ResizedSquare -Source $src -Size 192 -DestPath "frontend/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png"
Save-ResizedSquare -Source $src -Size 192 -DestPath "frontend/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png" -Round $true
Save-AdaptiveForeground -Source $src -Size 432 -DestPath "frontend/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png"

Write-Host "Generating Android splash screens..."
$splashConfigs = @(
    @{ Folder = "drawable"; W = 480; H = 320 },
    @{ Folder = "drawable-land-mdpi"; W = 480; H = 320 },
    @{ Folder = "drawable-land-hdpi"; W = 800; H = 480 },
    @{ Folder = "drawable-land-xhdpi"; W = 1280; H = 720 },
    @{ Folder = "drawable-land-xxhdpi"; W = 1600; H = 960 },
    @{ Folder = "drawable-land-xxxhdpi"; W = 1920; H = 1280 },
    @{ Folder = "drawable-port-mdpi"; W = 320; H = 480 },
    @{ Folder = "drawable-port-hdpi"; W = 480; H = 800 },
    @{ Folder = "drawable-port-xhdpi"; W = 720; H = 1280 },
    @{ Folder = "drawable-port-xxhdpi"; W = 960; H = 1600 },
    @{ Folder = "drawable-port-xxxhdpi"; W = 1280; H = 1920 }
)

foreach ($cfg in $splashConfigs) {
    $outP = "frontend/android/app/src/main/res/$($cfg.Folder)/splash.png"
    Save-Splash -Source $src -Width $cfg.W -Height $cfg.H -DestPath $outP
}

$src.Dispose()
Write-Host "All icons and splash screens successfully generated!"
