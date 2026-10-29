// Vacantes de ejemplo tomadas de data/vacantes.js del sitio
const vacantes = [
  {
    "id": 1,
    "titulo": "Enfermera Jefe de Urgencias",
    "empresa": "Clínica San Rafael",
    "ciudad": "Bogotá D.C.",
    "salarioMin": 4500000,
    "salarioMax": 6000000,
    "modalidad": "Presencial",
    "categoria": "Salud y Medicina",
    "etiquetas": [
      "Salud",
      "Liderazgo",
      "Turnos"
    ]
  },
  {
    "id": 2,
    "titulo": "Gerente de Mercadeo",
    "empresa": "Alpina",
    "ciudad": "Pereira, Risaralda",
    "salarioMin": 8000000,
    "salarioMax": 12000000,
    "modalidad": "Híbrido",
    "categoria": "Ventas y Mercadeo",
    "etiquetas": [
      "Mercadeo",
      "Estrategia",
      "Marca"
    ]
  },
  {
    "id": 3,
    "titulo": "Analista Contable Junior",
    "empresa": "Bancolombia",
    "ciudad": "Medellín, Antioquia",
    "salarioMin": 2800000,
    "salarioMax": 3500000,
    "modalidad": "Presencial",
    "categoria": "Finanzas y Contabilidad",
    "etiquetas": [
      "Contabilidad",
      "Excel",
      "NIIF"
    ]
  },
  {
    "id": 4,
    "titulo": "Desarrollador Frontend Junior",
    "empresa": "Confamiliar",
    "ciudad": "Pereira, Risaralda",
    "salarioMin": 3500000,
    "salarioMax": 4500000,
    "modalidad": "Remoto",
    "categoria": "Tecnología y Sistemas",
    "etiquetas": [
      "JavaScript",
      "React",
      "CSS"
    ]
  },
  {
    "id": 5,
    "titulo": "Profesor de Inglés - Bachillerato",
    "empresa": "Colegio Pino Verde",
    "ciudad": "Pereira, Risaralda",
    "salarioMin": 3000000,
    "salarioMax": 4000000,
    "modalidad": "Presencial",
    "categoria": "Educación y Docencia",
    "etiquetas": [
      "Inglés",
      "Pedagogía",
      "Bachillerato"
    ]
  },
  {
    "id": 6,
    "titulo": "Auxiliar Administrativo",
    "empresa": "La Rosa",
    "ciudad": "Manizales, Caldas",
    "salarioMin": 1800000,
    "salarioMax": 2200000,
    "modalidad": "Presencial",
    "categoria": "Administración y Oficina",
    "etiquetas": [
      "Archivo",
      "Atención",
      "Office"
    ]
  },
  {
    "id": 7,
    "titulo": "Ingeniero de Datos",
    "empresa": "Audifarma S.A.",
    "ciudad": "Cali, Valle del Cauca",
    "salarioMin": 5000000,
    "salarioMax": 7500000,
    "modalidad": "Remoto",
    "categoria": "Tecnología y Sistemas",
    "etiquetas": [
      "SQL",
      "Python",
      "ETL"
    ]
  },
  {
    "id": 8,
    "titulo": "Auxiliar de Farmacia",
    "empresa": "Farmatodo",
    "ciudad": "San Juan de Pasto, Nariño",
    "salarioMin": 1600000,
    "salarioMax": 2200000,
    "modalidad": "Presencial",
    "categoria": "Salud y Medicina",
    "etiquetas": [
      "Farmacia",
      "Inventario",
      "Atención"
    ]
  },
  {
    "id": 9,
    "titulo": "Operador de Maquinaria Pesada",
    "empresa": "Manpower Group Colombia",
    "ciudad": "Bucaramanga, Santander",
    "salarioMin": 2800000,
    "salarioMax": 4200000,
    "modalidad": "Presencial",
    "categoria": "Manufactura y Producción",
    "etiquetas": [
      "Manufactura",
      "Operación",
      "Certificación"
    ]
  },
  {
    "id": 10,
    "titulo": "Asesor de Servicio al Cliente Bilingüe",
    "empresa": "Avianca",
    "ciudad": "Pereira, Risaralda",
    "salarioMin": 2000000,
    "salarioMax": 3000000,
    "modalidad": "Presencial",
    "categoria": "Servicio al Cliente",
    "etiquetas": [
      "Servicio",
      "Bilingüe",
      "Aerolínea"
    ]
  },
  {
    "id": 11,
    "titulo": "Profesor de Matemáticas - Bachillerato",
    "empresa": "Colegio Técnico Superior",
    "ciudad": "Pereira, Risaralda",
    "salarioMin": 1500000,
    "salarioMax": 1500000,
    "modalidad": "Presencial",
    "categoria": "Educación y Docencia",
    "etiquetas": [
      "Educación",
      "Pedagogía",
      "Bachillerato"
    ]
  },
  {
    "id": 12,
    "titulo": "Ingeniero Civil - Obras Viales",
    "empresa": "Constructora Bolívar",
    "ciudad": "Medellín, Antioquia",
    "salarioMin": 3000000,
    "salarioMax": 3000000,
    "modalidad": "Presencial",
    "categoria": "Construcción y Obra",
    "etiquetas": [
      "Construcción",
      "Vías",
      "AutoCAD"
    ]
  },
  {
    "id": 13,
    "titulo": "Coordinador de Logística",
    "empresa": "DHL Colombia",
    "ciudad": "Barranquilla, Atlántico",
    "salarioMin": 3000000,
    "salarioMax": 3000000,
    "modalidad": "Presencial",
    "categoria": "Logística y Transporte",
    "etiquetas": [
      "Logística",
      "Transporte",
      "SAP"
    ]
  },
  {
    "id": 14,
    "titulo": "Chef Ejecutivo",
    "empresa": "Hotel Hilton Cartagena",
    "ciudad": "Cartagena, Bolívar",
    "salarioMin": 3500000,
    "salarioMax": 3500000,
    "modalidad": "Presencial",
    "categoria": "Turismo y Gastronomía",
    "etiquetas": [
      "Gastronomía",
      "Cocina",
      "Liderazgo"
    ]
  },
  {
    "id": 15,
    "titulo": "Abogado Laboralista Senior",
    "empresa": "Baker McKenzie",
    "ciudad": "Bogotá D.C.",
    "salarioMin": 10000000,
    "salarioMax": 16000000,
    "modalidad": "Híbrido",
    "categoria": "Legal",
    "etiquetas": [
      "Legal",
      "Derecho Laboral",
      "Litigio"
    ]
  },
  {
    "id": 16,
    "titulo": "Analista Financiero",
    "empresa": "Davivienda",
    "ciudad": "Cali, Valle del Cauca",
    "salarioMin": 5000000,
    "salarioMax": 7500000,
    "modalidad": "Híbrido",
    "categoria": "Finanzas y Contabilidad",
    "etiquetas": [
      "Finanzas",
      "Excel",
      "Análisis"
    ]
  }
];

export default vacantes;
