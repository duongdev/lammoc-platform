export type BulletSection = {
  ul: true
  text: string
  points: string[]
}

export type GeneratedContent = {
  shortDescription: string
  overview: string
  coreFeatures: BulletSection
  whoShouldBuy: BulletSection
  safetyNotes: BulletSection
  maintenance: BulletSection
  conclusion: string
  specifications: Record<string, string>
}

export function convertToHtml(json: GeneratedContent) {
  const { coreFeatures, whoShouldBuy, safetyNotes, maintenance } = json

  const coreFeaturesHtml = convertBulletSectionToHtml(coreFeatures)
  const whoShouldBuyHtml = convertBulletSectionToHtml(whoShouldBuy)
  const safetyNotesHtml = convertBulletSectionToHtml(safetyNotes)
  const maintenanceHtml = convertBulletSectionToHtml(maintenance)

  return `
    <h4><strong>Giới thiệu tổng quan</strong></h4>
    <p>${json.overview}</p>
    <h4><strong>Những điểm nổi bật của sản phẩm</strong></h4>
    ${coreFeaturesHtml}
    <h4><strong>Ai nên mua sản phẩm này</strong></h4>
    ${whoShouldBuyHtml}
    <h4><strong>Lưu ý an toàn khi dùng</strong></h4>
    ${safetyNotesHtml}
    <h4><strong>Bảo trì bảo dưỡng</strong></h4>
    ${maintenanceHtml}
    <h4><strong>Kết luận</strong></h4>
    <p>${json.conclusion}</p>
    <pre>Thông số kỹ thuật</pre>
    <table>
      <tbody>
        ${Object.entries(json.specifications)
          .map(([key, value]) => {
            return `
              <tr>
                <td><p>${key}</p></td>
                <td><p>${value}</p></td>
              </tr>
            `
          })
          .join('')}
      </tbody>
    </table>
  `
}

function convertBulletSectionToHtml(section: BulletSection) {
  const { text, points } = section
  return `
    <p>${text}</p>
    <ul>
      ${points
        .map((point) => {
          return `<li><p>${point}</p></li>`
        })
        .join('')}
    </ul>
  `
}