export class Product {
    id: string;
    type: string;
    brand: string;
    price: number;
    model: string;
    quantity: number;
    description: string;
    url: string;
    availability: boolean;

    constructor(){
        this.id= '';
        this.type = '';
        this.brand = '';
        this.price = 0;
        this.model = '';
        this.quantity = 0;
        this.description = '';
        this.url = '';
        this.availability = false;
    }
}
