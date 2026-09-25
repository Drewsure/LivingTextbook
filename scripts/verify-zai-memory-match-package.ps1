[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$PackageRoot
)

$ErrorActionPreference = "Stop"
$repositoryRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path.TrimEnd("\")

if ($PackageRoot -match "<|path[\\/\\]to|returned-package-folder") {
  throw "Replace the placeholder package path with the actual extracted Z.ai return folder."
}

if (-not (Test-Path -LiteralPath $PackageRoot -PathType Container)) {
  throw "Package root does not exist: $PackageRoot"
}

$resolvedInput = (Resolve-Path -LiteralPath $PackageRoot).Path
$manifestPath = Join-Path $resolvedInput "evidence\return-package.json"

if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
  $matches = @(
    Get-ChildItem -LiteralPath $resolvedInput -Recurse -File -Filter "return-package.json" |
      Where-Object { $_.Directory.Name -eq "evidence" }
  )

  if ($matches.Count -eq 0) {
    throw "No evidence\return-package.json was found below $resolvedInput. The frozen ZIP is source context, not a returned evidence package."
  }

  if ($matches.Count -gt 1) {
    throw "More than one evidence\return-package.json was found below $resolvedInput. Pass the exact candidate folder."
  }

  $resolvedInput = $matches[0].Directory.Parent.FullName
  $manifestPath = Join-Path $resolvedInput "evidence\return-package.json"
  Write-Host "Discovered candidate root: $resolvedInput"
}

$repoFullPath = [IO.Path]::GetFullPath($repositoryRoot).TrimEnd("\")
$candidateFullPath = [IO.Path]::GetFullPath($resolvedInput).TrimEnd("\")
if ($candidateFullPath.Equals($repoFullPath, [StringComparison]::OrdinalIgnoreCase) -or
    $candidateFullPath.StartsWith($repoFullPath + "\", [StringComparison]::OrdinalIgnoreCase)) {
  throw "Candidate package must remain outside the LivingTextbook repository: $candidateFullPath"
}

if ($candidateFullPath.ToLowerInvariant().Contains("frozen")) {
  throw "The frozen Z.ai snapshot cannot be submitted as the evidence package. Ask Z.ai for the separate returned package."
}

Write-Host "Candidate package: $candidateFullPath"
Write-Host "Manifest: $manifestPath"
Write-Host "Running the canonical package verifier..."

Push-Location -LiteralPath $repositoryRoot
try {
  $env:LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT = $candidateFullPath
  & npm run verify:phaser-candidate-package
  $exitCode = $LASTEXITCODE
} finally {
  Pop-Location
}

if ($exitCode -ne 0) {
  exit $exitCode
}

Write-Host "Memory Match evidence package passed the canonical verifier. No source was imported or promoted."
