import './Services.css';

interface Service {
  name: string;
  description: string;
}

const Services = () => {
  const services: Service[] = [
    { name: 'Corte de pelo', description: 'Corte personalizado adaptado a tu estilo' },
    { name: 'Corte de pelo + barba', description: 'Combo completo para un look impecable' },
    { name: 'Arreglo de barba', description: 'Perfilado y mantenimiento profesional' },
    { name: 'Lavado y secado', description: 'Tratamiento capilar con productos premium' },
    { name: 'Tinte', description: 'Coloración profesional con productos de calidad' },
    { name: 'Peinados especiales', description: 'Para eventos y ocasiones especiales' },
  ];

  return (
    <section className="services" id="servicios">
      <div className="services-container">
        <h2 className="services-title">Nuestros Servicios</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <h3 className="service-name">{service.name}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
