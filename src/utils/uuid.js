// ==== buildShortUUID  函数====
export function buildShortUUID (prefix = '') {
    let unique = 0
    const time = Date.now()
    const random = Math.floor(Math.random() * 1000000000)
    unique++
    return prefix + '_' + random + unique + String(time)
}

export function getUUID() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
  
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  }