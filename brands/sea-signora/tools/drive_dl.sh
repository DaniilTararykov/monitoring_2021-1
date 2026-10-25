#!/bin/bash
# Download Google Drive files by id (folder must be shared "anyone with the link").
# usage: drive_dl.sh list.tsv outdir      (list.tsv: <file_id>\t<file_name> per line)
# Get ids via the Google Drive MCP: search_files query "parentId = '<FOLDER_ID>'".
set -u
mkdir -p "$2"
while IFS=$'\t' read -r id name; do
  [ -z "$id" ] && continue
  [ -s "$2/$name" ] && continue
  for i in 1 2 3 4; do
    curl -sSL -o "$2/$name" "https://drive.usercontent.google.com/download?id=$id&export=download&confirm=t" && break
    sleep $((2**i))
  done
  if head -c 512 "$2/$name" | grep -qi "<html"; then
    echo "NO ACCESS (got HTML login page): $name — ask the owner to open link access" >&2
  fi
done < "$1"
