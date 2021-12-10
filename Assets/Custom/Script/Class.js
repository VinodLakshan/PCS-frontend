function User(userName, password)
{
    this.userName = userName;
    this.password = password;
}

function PaddySale(id, weight, paddyPrice, branch, customer, payment)
{
    this.id = id;
    this.weight = weight;
    this.paddyPrice = paddyPrice;
    this.branch = branch;
    this.customer = customer;
    this.payment = payment;
}

function Branch(id)
{
    this.id = id;
}

function PaddyPrice(id)
{
    this.id = id;
}

function Customer(name)
{
    this.name = name;
}

function Payment(amount)
{
    this.amount = amount;
}

function Vehicles(id)
{
    this.id = id;
}

function DateRange(startDate, endDate)
{
    this.startDate = startDate;
    this.endDate = endDate;
}