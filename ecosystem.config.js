module.exports = {
  apps : [{
	name: 'dev',
    	script: './dist/app.js',
    	watch: ['src'],
	instances: -1,
	max_memory_restart: '1024',
	env: {
	  	Server_PORT: 8081,
		NODE_ENV: 'dev',
	},
  }]
};
