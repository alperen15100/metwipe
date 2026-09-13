"""Synthetic fixtures only. Requires Pillow and ffmpeg; no personal files."""
from PIL import Image,PngImagePlugin
from pathlib import Path
import zipfile,subprocess,os
p=Path(os.environ.get('MW_FIXTURES','/workspace/scratch/mw-fixtures'));p.mkdir(parents=True,exist_ok=True)
im=Image.new('RGB',(16,16),'purple');e=Image.Exif();e[271]='MetWipe synthetic camera';im.save(p/'sample.jpg',exif=e)
i=PngImagePlugin.PngInfo();i.add_text('Author','MetWipe synthetic author');im.save(p/'sample.png',pnginfo=i);im.save(p/'sample.webp',exif=e)
for ext,entry in [('docx','word/document.xml'),('xlsx','xl/workbook.xml'),('pptx','ppt/presentation.xml')]:
 with zipfile.ZipFile(p/('sample.'+ext),'w',zipfile.ZIP_DEFLATED) as z:
  z.writestr('docProps/core.xml','<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:creator>Synthetic Author</dc:creator></cp:coreProperties>')
  z.writestr(entry,'<test>Preserve this payload</test>')
for ext in ['mp3','wav']:
 subprocess.run(['ffmpeg','-y','-v','error','-f','lavfi','-i','anullsrc=r=44100:cl=mono','-t','0.2','-metadata','title=MetWipe synthetic title',str(p/('sample.'+ext))],check=True)
