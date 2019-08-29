

async function leerDataJSON(url) {
    let data = null;
    try {
        data = await axios.get(url); 
        return data;
    } catch (err) {
        console.log(err);
    }
}


// const socialData = leerDataJSON('./environments/env.json');

var iconoSocialesComponent = new Vue({
    el: '#iconosSocialesComponent',
    data: {
        iconosSociales: []
    },
    mounted: async function () {
        const response_icons = await leerDataJSON('./environments/env.json');
        console.log('Iconos', response_icons);
        this.iconosSociales = response_icons.data.iconos_sociales;
    }
});