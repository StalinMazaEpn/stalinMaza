

async function leerDataJSON(url) {
    let iconos = null;
    try {
        iconos = await axios.get(url); 
        return iconos;
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
        this.iconosSociales = response_icons.data.iconos_sociales;
    }
});