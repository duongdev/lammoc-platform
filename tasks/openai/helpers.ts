import jsdom from 'jsdom'

export type BulletSection =
  | {
      ul: true
      text: string
      points: string[]
    }
  | Omit<Record<string, string>, 'ul' | 'points'>

export type GeneratedContent = {
  shortDescription: string
  overview: string
  coreFeatures: BulletSection
  whoShouldBuy: BulletSection
  whoShouldBy: BulletSection
  safetyNotes: BulletSection
  maintenance: BulletSection
  conclusion: string
  specifications: Record<string, string>
}

export function convertToHtml(json: GeneratedContent) {
  try {
    const {
      coreFeatures,
      whoShouldBuy,
      whoShouldBy,
      safetyNotes,
      maintenance,
    } = json

    const coreFeaturesHtml = convertBulletSectionToHtml(coreFeatures)
    const whoShouldBuyHtml = convertBulletSectionToHtml(
      whoShouldBuy || whoShouldBy,
    )
    const safetyNotesHtml = convertBulletSectionToHtml(safetyNotes)
    const maintenanceHtml = convertBulletSectionToHtml(maintenance)

    /* cSpell:disable */
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
    /* cSpell:enable */
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}\n${JSON.stringify(json, null, 2)}`)
    }
  }
}

function convertBulletSectionToHtml(section: BulletSection) {
  if (section.points instanceof Array) {
    const { points } = section
    return `
    <ul>
      ${points
        .map((point) => {
          return `<li><p>${point}</p></li>`
        })
        .join('')}
    </ul>
  `
  }

  return `<ul>
    ${Object.entries(section)
      .map(([key, value]) => {
        return `<li><p><strong>${key}</strong>${
          value ? `: ${value}` : ''
        }</p></li>`
      })
      .join('')}
  </ul>`
}

export function getPlainProductInput(name: string, description: string) {
  // Run on node.js
  const { JSDOM } = jsdom
  const dom = new JSDOM(description)
  const { document } = dom.window
  const desc =
    document.body.textContent
      ?.trim()
      // replace multiple spaces with single space
      .replace(/\s\s+/g, ' ')
      // replace multiple newlines with single newline
      .replace(/\n\n+/g, '\n')
      .trim() ?? ''

  return {
    name,
    description: desc,
  }
}
