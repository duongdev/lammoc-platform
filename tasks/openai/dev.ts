import { SapoWeb } from 'tasks/sapo/services/sapo-web.service'

import { convertToHtml, getPlainProductInput } from './helpers'
import { generateProductDescription } from './openai'

const NAME = 'Hộp dụng cụ trong suốt RINGSTAR R-345'
const DESCRIPTION = `
<h3>HỘP DỤNG CỤ TRONG SUỐT RINGSTAR R-345</h3>
<p>Kích thước: 347×167×119mm .&nbsp;Chất liệu: Nhựa PP cao cấp .&nbsp;Trọng lượng: 0.55kg</p>
<p>Sản xuất 100% tại Nhật Bản bằng chất liệu nhựa trong suốt và độ bền cao .&nbsp;Khả năng chống trầy.&nbsp;Nhỏ gọn, tiện lợi</p>
`

async function dev() {
  const sapoWeb = new SapoWeb()
  sapoWeb.syncSEOProductDescription()
  // const product = getPlainProductInput(NAME, DESCRIPTION.trim())

  // const generatedContent = await generateProductDescription(product)

  // if (!generatedContent) {
  //   console.log('No generated content')
  //   return
  // }

  // console.log('generatedContent', generatedContent)

  // console.log(convertToHtml(generatedContent))
}

dev()
