function polishing (num) {
  return num < 10 ? `0${num}` : num.toString()
}

function formatDate (date) {
  const year = date.getFullYear()
  const month = polishing(date.getMonth() + 1)
  const day = polishing(date.getDate())
  return `${year}-${month}-${day}`
}

function log (msg) {
  console.log(`[ ${new Date().toISOString()} ] ${msg}`)
}

const util = {
  polishing,
  formatDate,
  log,
}

export default util