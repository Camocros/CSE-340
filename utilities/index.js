const Util = {}

Util.buildVehicleDetail = async function (data) {
  let detail = ""

  if (data) {
    detail = `
      <section class="vehicle-detail">
        <div class="vehicle-detail__image">
          <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}">
        </div>
        <div class="vehicle-detail__info">
          <h2>${data.inv_make} ${data.inv_model}</h2>
          <p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(data.inv_price)}</p>
          <p><strong>Description:</strong> ${data.inv_description}</p>
          <p><strong>Color:</strong> ${data.inv_color}</p>
          <p><strong>Miles:</strong> ${new Intl.NumberFormat("en-US").format(data.inv_miles)}</p>
        </div>
      </section>
    `
  }

  return detail
}

Util.handleErrors = function (fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

module.exports = Util