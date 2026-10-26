# Unifold vs Fun.xyz

One static page. No build step.

## Files
- index.html: the whole page
- flows/: your videos and images (bridge-fun-1.png and bridge-fun-2.png are already here)

## Put it online
- GitHub Pages: repo Settings > Pages > deploy from the main branch, root folder.
- Vercel: import the repo at vercel.com/new, framework "Other", no build command.

## Add a video or image to a row
1. Name the file after the row and the side: <row>-<fun|uni>.<ext>, for example headless-uni.mp4.
   Rows that take recordings: providers, lowkyc, headless, bridge.
2. Upload it into the flows folder on GitHub (Add file > Upload files).
3. In index.html, find the MEDIA block, remove the /* and */ around the matching line, and fix the filename if needed.
4. Commit. The site updates in about a minute.

Use MP4 (H.264) for recordings. They play muted and loop. Keep each file under about 10 MB; GIFs are much larger than MP4 for the same clip.
