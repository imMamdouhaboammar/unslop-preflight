# Arabic and RTL UI Rules

## Core principle

RTL is not text alignment. It changes reading path, navigation order, icon direction, form rhythm, table scanning, and data comprehension.

## Layout

- Primary navigation starts from the right.
- Main action should appear where the Arabic reading path naturally ends or where the task expects it.
- Icons that imply direction must be mirrored.
- Icons that represent brands, logos, playback, settings, files, or universal symbols should not be mirrored unless required.
- Breadcrumbs move right to left.
- Step indicators move right to left.

## Typography

- Use Arabic fonts built for screen reading.
- Minimum body size: 15px for Arabic-heavy UI.
- Recommended Arabic body line height: 1.65 to 1.8.
- Avoid tight letter spacing for Arabic.
- Do not use all caps styling on mixed English labels inside Arabic UI.

## Forms

- Labels align right.
- Helper text aligns right.
- Error text appears under the field and explains recovery.
- Input direction should follow expected content. Arabic names use RTL, emails and URLs use LTR.
- Password reveal icons should remain spatially consistent.

## Numbers and mixed language

- Define whether numbers use Arabic-Indic or Latin digits.
- Use Latin digits for technical metrics, IDs, URLs, currency formulas, and dashboards unless the product demands Arabic-Indic.
- Mixed Arabic and English labels need spacing rules to avoid cramped text.

## Tables and dashboards

- Row labels align right.
- Numeric columns can align left or use tabular alignment depending on scanning pattern.
- Charts should keep axis labels readable and avoid mirrored data meaning.
- Filters should follow task priority, not only visual symmetry.

## Buttons

- In RTL, leading icons appear on the right when the icon supports the action label.
- Directional icons must be mirrored.
- Destructive actions should not rely on color alone.

## Common mistakes

- Only adding `dir="rtl"` and leaving the layout mentally LTR.
- Mirroring logos.
- Mirroring charts in a way that changes meaning.
- Keeping English spacing around Arabic labels.
- Using line height designed for Latin text.
