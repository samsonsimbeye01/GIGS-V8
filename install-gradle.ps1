# =============================================
# Auto Install Gradle on Windows
# =============================================

# 1. Set Gradle version
$gradleVersion = "9.3.0"
$gradleZipUrl = "https://services.gradle.org/distributions/gradle-$gradleVersion-bin.zip"

# 2. Set install path
$installPath = "C:\Gradle"

# 3. Download Gradle
Write-Host "Downloading Gradle $gradleVersion..."
$zipFile = "$env:TEMP\gradle-$gradleVersion-bin.zip"
Invoke-WebRequest -Uri $gradleZipUrl -OutFile $zipFile

# 4. Extract Gradle
Write-Host "Extracting Gradle to $installPath..."
Expand-Archive -Path $zipFile -DestinationPath $installPath -Force

# 5. Set environment variable (PATH)
$gradleBin = "$installPath\gradle-$gradleVersion\bin"
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";" + $gradleBin, [EnvironmentVariableTarget]::Machine)

# 6. Verify installation
Write-Host "Verifying Gradle installation..."
gradle -v

Write-Host "✅ Gradle $gradleVersion installed successfully!"
Write-Host "You may need to restart PowerShell to apply the PATH changes."
