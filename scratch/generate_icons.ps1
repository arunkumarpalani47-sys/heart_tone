Add-Type -AssemblyName System.Drawing

function Render-HeartToneIcon {
    param (
        [int]$Size,
        [string]$OutputPath,
        [string]$Style = "full" # "foreground", "full", "round", "splash"
    )

    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $bgColor = [System.Drawing.Color]::FromArgb(255, 13, 7, 11) # #0d070b
    $pink1 = [System.Drawing.Color]::FromArgb(255, 255, 42, 95)  # #ff2a5f
    $pink2 = [System.Drawing.Color]::FromArgb(255, 251, 113, 133) # #fb7185
    $glowColor = [System.Drawing.Color]::FromArgb(70, 255, 42, 95)

    if ($Style -eq "foreground") {
        $g.Clear([System.Drawing.Color]::Transparent)
    } elseif ($Style -eq "round") {
        $g.Clear([System.Drawing.Color]::Transparent)
        $bgBrush = New-Object System.Drawing.SolidBrush $bgColor
        $g.FillEllipse($bgBrush, 0, 0, $Size, $Size)
        $bgBrush.Dispose()
    } else {
        $g.Clear($bgColor)
    }

    # Calculate heart dimensions
    # For adaptive foreground: inner safe zone is center 66% (from 17% to 83%)
    $scale = if ($Style -eq "foreground") { $Size * 0.58 } else { $Size * 0.70 }
    $cx = $Size / 2.0
    # Center heart slightly vertically so visual center matches geometric center
    $cy = if ($Style -eq "foreground") { $Size * 0.49 } else { $Size * 0.49 }

    # Draw subtle glow if not pure foreground
    if ($Style -ne "foreground") {
        for ($i = 6; $i -ge 1; $i--) {
            $glowScale = $scale + ($i * $Size * 0.02)
            $glowAlpha = [int](15 * (7 - $i) / 6)
            $curGlow = [System.Drawing.Color]::FromArgb($glowAlpha, 255, 42, 95)
            $glowBrush = New-Object System.Drawing.SolidBrush $curGlow
            $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
            
            $topY = $cy - ($glowScale * 0.42)
            $botY = $cy + ($glowScale * 0.48)
            $leftX = $cx - ($glowScale * 0.48)
            $rightX = $cx + ($glowScale * 0.48)
            $midY = $cy - ($glowScale * 0.15)
            $notchY = $cy - ($glowScale * 0.28)

            $gp.AddBezier($cx, $botY, $leftX, $cy + ($glowScale * 0.15), $leftX, $midY, $leftX, $topY + ($glowScale * 0.18))
            $gp.AddBezier($leftX, $topY + ($glowScale * 0.18), $leftX, $topY, $cx - ($glowScale * 0.08), $topY, $cx, $notchY)
            $gp.AddBezier($cx, $notchY, $cx + ($glowScale * 0.08), $topY, $rightX, $topY, $rightX, $topY + ($glowScale * 0.18))
            $gp.AddBezier($rightX, $topY + ($glowScale * 0.18), $rightX, $midY, $rightX, $cy + ($glowScale * 0.15), $cx, $botY)

            $g.FillPath($glowBrush, $gp)
            $glowBrush.Dispose()
            $gp.Dispose()
        }
    }

    # Heart Path
    $topY = $cy - ($scale * 0.42)
    $botY = $cy + ($scale * 0.48)
    $leftX = $cx - ($scale * 0.48)
    $rightX = $cx + ($scale * 0.48)
    $midY = $cy - ($scale * 0.15)
    $notchY = $cy - ($scale * 0.28)

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddBezier($cx, $botY, $leftX, $cy + ($scale * 0.15), $leftX, $midY, $leftX, $topY + ($scale * 0.18))
    $path.AddBezier($leftX, $topY + ($scale * 0.18), $leftX, $topY, $cx - ($scale * 0.08), $topY, $cx, $notchY)
    $path.AddBezier($cx, $notchY, $cx + ($scale * 0.08), $topY, $rightX, $topY, $rightX, $topY + ($scale * 0.18))
    $path.AddBezier($rightX, $topY + ($scale * 0.18), $rightX, $midY, $rightX, $cy + ($scale * 0.15), $cx, $botY)

    $gradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush `
        (New-Object System.Drawing.PointF $leftX, $topY), `
        (New-Object System.Drawing.PointF $rightX, $botY), `
        $pink1, $pink2

    $g.FillPath($gradBrush, $path)

    # Cutout note inside the heart
    $cutBrush = if ($Style -eq "foreground") {
        New-Object System.Drawing.SolidBrush $bgColor
    } else {
        New-Object System.Drawing.SolidBrush $bgColor
    }

    # Musical Note: note head circle
    $noteRadius = $scale * 0.085
    $noteX = $cx - ($scale * 0.09)
    $noteY = $cy + ($scale * 0.03)
    $g.FillEllipse($cutBrush, $noteX - $noteRadius, $noteY - $noteRadius, $noteRadius * 2, $noteRadius * 2)

    # Musical Note stem
    $stemWidth = $scale * 0.035
    $stemHeight = $scale * 0.26
    $stemX = $noteX + $noteRadius - ($stemWidth * 0.8)
    $stemY = $noteY - $stemHeight
    $g.FillRectangle($cutBrush, $stemX, $stemY, $stemWidth, $stemHeight)

    # Musical Note flag curve
    $flagPen = New-Object System.Drawing.Pen $cutBrush, ($stemWidth * 1.05)
    $flagPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $flagPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $flagPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $flagPath.AddBezier($stemX + ($stemWidth / 2.0), $stemY, `
                        $stemX + ($scale * 0.09), $stemY - ($scale * 0.02), `
                        $stemX + ($scale * 0.16), $stemY + ($scale * 0.04), `
                        $stemX + ($scale * 0.18), $stemY + ($scale * 0.12))
    $g.DrawPath($flagPen, $flagPath)

    # Save output
    $parent = Split-Path -Parent $OutputPath
    if (-not (Test-Path $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }

    $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $flagPath.Dispose()
    $flagPen.Dispose()
    $cutBrush.Dispose()
    $gradBrush.Dispose()
    $path.Dispose()
    $g.Dispose()
    $bmp.Dispose()
}

# Test render at 512x512
Render-HeartToneIcon -Size 512 -OutputPath "D:\SoulSync-main\scratch\heart_test.png" -Style "full"
Render-HeartToneIcon -Size 512 -OutputPath "D:\SoulSync-main\scratch\heart_fg_test.png" -Style "foreground"
Render-HeartToneIcon -Size 512 -OutputPath "D:\SoulSync-main\scratch\heart_round_test.png" -Style "round"
Write-Host "Icons generated successfully"
