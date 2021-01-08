interface IPeriod{
  initial: Date
  end: Date
}

export const getPeriod = (m: number, year: number): IPeriod => {
  let date: any = new Date().setMonth(m)
  date = new Date(date).setFullYear(year)
  date = new Date(date)

  const initial = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  return {
    initial,
    end
  }
}
