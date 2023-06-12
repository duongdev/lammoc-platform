import { convertToHtml } from "./helpers"
import { generateProductDescription } from "./openai"

async function dev() {
  const product = {
    name: 'Máy khoan bê tông cầm tay Bosch GBH 2-24 DRE 06112721K0',
    description: `Thông số kỹ thuật:
Công suất đầu vào định mức: 790 W
Năng lượng va đập, lên tới: 2,7 J
Trọng lượng: 2,8 kg
Kích thước dụng cụ (chiều dài): 367 mm
Kích thước dụng cụ (chiều cao): 210 mm
Bộ gá dụng cụ: SDS plus
Phạm vi khoan
Đường kính khoan tối đa trên tường gạch, máy cắt lõi: 68 mm
Đường kính khoan tối đa trên kim loại: 13 mm
Đường kính khoan tối đa trên gỗ: 30 mm`,
  }

  const generatedContent = await generateProductDescription(product)

  console.log('generatedContent', generatedContent)

  console.log(convertToHtml(generatedContent))
}

dev()
