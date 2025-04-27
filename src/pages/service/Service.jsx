import React from "react";
import "./Service.css";
import services from "../../data/service.json";

const Service = () => {
  return (
    <div>
      <div className="services-container">
        <h1 className="services-title">Our Services</h1>
        <div className="services-div">
          {services.map((service, index) => (
            <div className="service-box" key={index}>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
