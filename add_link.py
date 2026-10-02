import pymupdf

pdf_path = 'apps/ia/public/real-estate/MR Real Estate - CENI.pdf'
doc = pymupdf.open(pdf_path)
page = doc[0]

rect = page.rect
link = {'kind': pymupdf.LINK_URI, 'from': rect, 'uri': 'https://ia.mrtechnology.it.com/catalogo'}
page.insert_link(link)

doc.save('apps/ia/public/real-estate/MR Real Estate - CENI_linked.pdf')
doc.close()
