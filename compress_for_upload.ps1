Get-Item * -Exclude .git,.gitignore,compress_for_upload.ps1 | Compress-Archive -DestinationPath quiz_maker_for_Language.zip
