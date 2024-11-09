const axios = require('axios');

// Configuration
const PORT_API_URL = 'https://api.getport.io/v1';
const API_KEY = 'YOUR_API_KEY';

// Common axios config
const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': API_KEY
  }
};

// 1. Create Blueprints
async function createBlueprints() {
  // Framework Blueprint
  const frameworkBlueprint = {
    identifier: 'framework',
    title: 'Framework',
    properties: {
      state: {
        type: 'string',
        title: 'State',
        enum: ['Active', 'EOL'],
        description: 'Current state of the framework'
      }
    }
  };

  // Service Blueprint
  const serviceBlueprint = {
    identifier: 'service',
    title: 'Service',
    properties: {
      number_of_eol_packages: {
        type: 'number',
        title: 'Number of EOL Packages',
        description: 'Count of EOL frameworks used by this service'
      }
    },
    relations: {
      frameworks: {
        title: 'Used Frameworks',
        target: 'framework',
        many: true,
        required: false
      }
    }
  };

  try {
    await axios.post(`${PORT_API_URL}/blueprints`, frameworkBlueprint, axiosConfig);
    await axios.post(`${PORT_API_URL}/blueprints`, serviceBlueprint, axiosConfig);
    console.log('Blueprints created successfully');
  } catch (error) {
    console.error('Error creating blueprints:', error.response?.data || error);
  }
}

// 2. Create Mock Framework Entities
async function createMockFrameworks() {
  const frameworks = [
    {
      identifier: 'react',
      title: 'React',
      properties: {
        state: 'Active'
      }
    },
    {
      identifier: 'angular-js',
      title: 'AngularJS',
      properties: {
        state: 'EOL'
      }
    },
    {
      identifier: 'jquery',
      title: 'jQuery',
      properties: {
        state: 'EOL'
      }
    },
    {
      identifier: 'vue',
      title: 'Vue.js',
      properties: {
        state: 'Active'
      }
    }
  ];

  for (const framework of frameworks) {
    try {
      await axios.post(
        `${PORT_API_URL}/blueprints/framework/entities`, 
        framework, 
        axiosConfig
      );
    } catch (error) {
      console.error(`Error creating framework ${framework.identifier}:`, error.response?.data || error);
    }
  }
  console.log('Mock frameworks created successfully');
}

// 3. Create Mock Services
async function createMockServices() {
  const services = [
    {
      identifier: 'frontend-app',
      title: 'Frontend Application',
      relations: {
        frameworks: ['react', 'jquery']
      }
    },
    {
      identifier: 'legacy-app',
      title: 'Legacy Application',
      relations: {
        frameworks: ['angular-js', 'jquery']
      }
    },
    {
      identifier: 'modern-app',
      title: 'Modern Application',
      relations: {
        frameworks: ['react', 'vue']
      }
    }
  ];

  for (const service of services) {
    try {
      await axios.post(
        `${PORT_API_URL}/blueprints/service/entities`, 
        service, 
        axiosConfig
      );
    } catch (error) {
      console.error(`Error creating service ${service.identifier}:`, error.response?.data || error);
    }
  }
  console.log('Mock services created successfully');
}

// 4. Calculate and Update EOL Package Counts
async function updateEOLPackageCounts() {
  try {
    // Get all services
    const servicesResponse = await axios.get(
      `${PORT_API_URL}/blueprints/service/entities`,
      axiosConfig
    );
    const services = servicesResponse.data.entities;

    // Get all frameworks
    const frameworksResponse = await axios.get(
      `${PORT_API_URL}/blueprints/framework/entities`,
      axiosConfig
    );
    const frameworks = frameworksResponse.data.entities;

    // Create a map of framework identifiers to their EOL status
    const frameworkEOLMap = frameworks.reduce((acc, framework) => {
      acc[framework.identifier] = framework.properties.state === 'EOL';
      return acc;
    }, {});

    // Update each service with its EOL package count
    for (const service of services) {
      const serviceFrameworks = service.relations.frameworks || [];
      const eolCount = serviceFrameworks.filter(fw => frameworkEOLMap[fw]).length;

      // Update the service with the EOL count
      await axios.patch(
        `${PORT_API_URL}/blueprints/service/entities/${service.identifier}`,
        {
          properties: {
            number_of_eol_packages: eolCount
          }
        },
        axiosConfig
      );
      console.log(`Updated ${service.identifier} with ${eolCount} EOL packages`);
    }
  } catch (error) {
    console.error('Error updating EOL package counts:', error.response?.data || error);
  }
}

// Main execution function
async function main() {
  try {
    // Create the environment
    await createBlueprints();
    await createMockFrameworks();
    await createMockServices();

    // Calculate and update EOL package counts
    await updateEOLPackageCounts();
    
    console.log('Process completed successfully');
  } catch (error) {
    console.error('Error in main execution:', error);
  }
}

// Run the script
main();