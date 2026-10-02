import pymupdf

pdf_path = 'apps/ia/public/real-estate/MR Real Estate - CENI.pdf'
doc = pymupdf.open(pdf_path)
page = doc[0]

# Delete all existing links
for link in page.links():
    page.delete_link(link)

# Add the new specific link over the button area
rect = pymupdf.Rect(289.6, 760.2, 1158.4, 977.4)
link = {'kind': pymupdf.LINK_URI, 'from': rect, 'uri': 'https://ia.mrtechnology.it.com/catalogo'}
page.insert_link(link)

doc.save('apps/ia/public/real-estate/MR Real Estate - CENI_fixed.pdf')
doc.close()
