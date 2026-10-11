import { describe, expect, it } from 'vitest'
import ru from './ru'
import en from './en'
import { chapterStrings } from './markup'

// Раздел 9 задания раунда 1: точные русские замены RU-01…RU-08 (утверждены автором) и согласованные EN-фрагменты.
const text = (c: typeof ru) => c.chapters.flatMap((ch) => chapterStrings(ch)).join('\n')
const RU = text(ru)
const EN = text(en as typeof ru)

const APPLIED: [string, string, string][] = [
  ['RU-01', 'Результат анализа мтДНК — это доля, а не генотип.', 'При ПГТ-мт определяют долю исследуемого варианта мтДНК в образце. Этот количественный показатель лежит в основе объяснений в разделе «Основы ПГТ-мт».'],
  ['RU-02', '**Следствие для диагностики:**', '**Следствие для ПГТ-мт:** при исследовании гетероплазмии определяют долю выбранного варианта мтДНК в образце. Поэтому для сравнения эмбрионов используют количественные значения гетероплазмии (глава 5).'],
  ['RU-03', 'оно ничего не говорит о распределении между клетками пробы', 'Это значение характеризует совокупность молекул в пробе. По нему нельзя восстановить уровень гетероплазмии в каждой отдельной клетке.'],
  ['RU-04', 'Такой разброс — правило, а не исключение', 'Этот пример показывает, что уровень гетероплазмии может существенно различаться между ооцитами одной носительницы. По уровню гетероплазмии у матери нельзя заранее определить долю варианта в конкретном ооците [@smeets2023].'],
  ['RU-05', 'Если бы все ооциты наследовали уровень матери', 'Различия в уровне гетероплазмии между ооцитами и эмбрионами создают возможность выбора эмбриона с более низкой долей исследуемого варианта мтДНК.'],
  ['RU-06', 'неудачный цикл — ожидаемый исход, а не исключение', 'В программе Newcastle у пяти пациенток ПГТ не удалось получить эмбрион с гетероплазмией ниже 30% [@hyslop2025]. Это наблюдение показывает, что ПГТ-мт не всегда позволяет получить эмбрион, удовлетворяющий выбранному критерию.'],
  ['RU-07', 'Для ПГТ-мт у эмбриона берут несколько клеток.', 'Для ПГТ-мт исследуют клетки, полученные при биопсии эмбриона. Интерпретация результата зависит от стадии развития эмбриона, места биопсии и того, насколько измеренный уровень гетероплазмии соответствует другим клеткам эмбриона.'],
  ['RU-08', 'При ПГТ-мт генотипов нет', 'При ПГТ-мт сравнивают количественные значения гетероплазмии у эмбрионов одного цикла.'],
]

describe('approved Russian replacements (section 9)', () => {
  for (const [id, was, now] of APPLIED) {
    it(`${id} applied verbatim`, () => {
      expect(RU).toContain(now)
      expect(RU).not.toContain(was)
    })
  }

  it('neighbouring sentences and references are kept', () => {
    expect(RU).toContain('от 9 до 90%, а в эмбрионах — от 7 до 91% [@treff2012]')
    expect(RU).toContain('Но та же изменчивость делает результат цикла непредсказуемым')
    expect(RU).toContain('[@mavraki2023; @spath2021]')
    expect(RU).toContain('При ПГТ-М цель — эмбрион без патогенного генотипа')
  })

  it('English counterparts follow the approved Russian meaning', () => {
    for (const s of ['An mtDNA result is a proportion, not a genotype', 'a nuclear gene test returns a genotype', 'says nothing about how the variant is distributed', 'the rule rather than the exception', 'there would be nothing to choose from', 'an expected outcome, not an exception', 'a few cells are taken from the embryo', 'In PGT-mt there are no genotypes']) {
      expect(EN).not.toContain(s)
    }
    expect(EN).toContain('In PGT-mt, quantitative heteroplasmy values are compared between embryos of the same cycle.')
  })
})
