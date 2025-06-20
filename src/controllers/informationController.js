class InformationController {
    // GET /banner
    async getBanners(req, res, next) {
      try {
        const query = `
          SELECT banner_name, banner_image, description 
          FROM banners 
          WHERE is_active = TRUE 
          ORDER BY display_order ASC
        `;
        
        const [banners] = await pool.execute(query);
  
        res.status(200).json({
          status: 0,
          message: 'Sukses',
          data: banners
        });
      } catch (error) {
        next(error);
      }
    }
  
    // GET /services
    async getServices(req, res, next) {
      try {
        const query = `
          SELECT service_code, service_name, service_icon, service_tariff 
          FROM services 
          WHERE is_active = TRUE 
          ORDER BY service_name ASC
        `;
        
        const [services] = await pool.execute(query);
  
        res.status(200).json({
          status: 0,
          message: 'Sukses',
          data: services
        });
      } catch (error) {
        next(error);
      }
    }
  }
  
  module.exports = new InformationController();