import pymupdf

pdf_path = 'apps/ia/public/real-estate/MR Real Estate - CENI.pdf'
doc = pymupdf.open(pdf_path)
page = doc[0]

# Delete all existing links to be safe
for link in page.links():
    page.delete_link(link)

# Add link covering the entire page
rect = page.rect
link = {'kind': pymupdf.LINK_URI, 'from': rect, 'uri': 'https://ia.mrtechnology.it.com/catalogo'}
page.insert_link(link)

doc.save('apps/ia/public/real-estate/MR Real Estate - CENI_full.pdf')
doc.close()
