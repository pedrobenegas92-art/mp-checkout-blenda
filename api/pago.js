const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

const productos = {
  'registros-online': {
    title: 'Sesión de Registros Akáshicos On-line',
    price: 111000,
    success: 'https://blendaenmision.com/registros-gracias'
  },
  'registros-presencial': {
    title: 'Sesión de Registros Akáshicos Presencial',
    price: 129000,
    success: 'https://blendaenmision.com/registros-presencial-gracias'
  },
  'sanacion-online': {
    title: 'Sesión de Sanación Giri Agni On-line',
    price: 99000,
    success: 'https://blendaenmision.com/sanacion-gracias'
  },
  'sanacion-presencial': {
    title: 'Sesión de Sanación Giri Agni Presencial',
    price: 114000,
    success: 'https://blendaenmision.com/sanacion-presencial-gracias'
  }
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { producto } = req.query;
  const item = productos[producto];

  if (!item) {
    return res.status(400).send('Producto no encontrado');
  }

  try {
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [{
          title: item.title,
          quantity: 1,
          unit_price: item.price,
          currency_id: 'ARS'
        }],
        back_urls: {
          success: item.success
        },
        auto_return: 'approved'
      }
    });

    res.redirect(result.init_point);
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
};
