
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import 'primeicons/primeicons.css';
import axios from 'axios';


import './style.css'
//import UploadCloud from '../UploadCloudnary/UploadCloud';

export default function ProductsDemo() {
    let emptyProduct = {
        produto_id: null,
        produto_nome: '',
        categoria_id: null,
        quantidade: 0,
        preco_compra: 0,
        preco_venda: 0,
        data_vencimento: '',
        img64: null
    };

    const [products, setProducts] = useState([{ ...emptyProduct }]);
    const [categoria, setCategoria] = useState(null)
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    //const [uploadedImage, setUploadedImage] = useState(null);

    useEffect(() => {
        buscarProdutos();
        buscarCategorias();
    }, []);

    //#region Produtos
    const buscarProdutos = () => {
        axios({
            method: 'get',
            url: 'http://localhost:3000/produto/'
        }).then((res) => setProducts(res.data))
            .catch((err) => {
                if (err.code == "ERR_NETWORK") {
                    toast.current.show({ severity: 'error', summary: 'Erro nos produtos: API FORA!', life: 8000 });
                }
            })
    }
    const criarProduto = (prod) => {
        axios({
            method: 'post',
            url: 'http://localhost:3000/produto/cadastro',
            data: prod
        }).then(() => {
            toast.current.show({ severity: 'success', summary: 'Produto criado com sucesso!' });
            buscarProdutos()
        })
            .catch((err) => {
                if (err.code == "ERR_NETWORK") {
                    toast.current.show({ severity: 'error', summary: 'Erro ao salvar o produto! Possivel problema: API FORA', life: 8000 });
                }
            })
    }
    const editarProduto = (prod, id) => {
        axios({
            method: 'patch',
            url: `http://localhost:3000/produto/update/${id}`,
            data: prod
        }).then(() => {
            buscarProdutos()
            toast.current.show({ severity: 'success', summary: 'Produto atualizado com sucesso!', life: 3000 });
        })
            .catch((err) => {
                if (err.code == "ERR_NETWORK") {
                    toast.current.show({ severity: 'error', summary: 'Erro ao editar o produto! Possivel problema: API FORA', life: 8000 });
                }
            })
    }
    const apagarProduto = (id) => {
        axios({
            method: 'delete',
            url: `http://localhost:3000/produto/delete/${id}`
        }).then(() => {
            buscarProdutos()
            toast.current.show({ severity: 'success', summary: 'Produto apagado com sucesso!', life: 3000 });
        }).catch((err) => {
            console.log(err)
            if (err.code == 'ERR_NETWORK') {
                toast.current.show({ severity: 'error', summary: 'Erro ao apagar o produto! Possivel problema: API FORA', life: 8000 });
            } else if (err.code == 'ERR_BAD_RESPONSE') {
                toast.current.show({ severity: 'error', summary: 'Erro ao apagar o produto! Possivel problema: Produto associado a uma venda', life: 8000 });
            }
        })
    }

    //    const onUploadImg = (e) => {
    //     // Supondo que queremos apenas a primeira imagem
    //     const file = e.files[0];

    //     axios({
    //         method: 'post',
    //         url: 'http://localhost:3000/produto/cadastro/upload',
    //         data: file
    //     })
    //     }

    //#endregion

    //#region Categorias
    const buscarCategorias = () => {
        axios({
            method: 'get',
            url: 'http://localhost:3000/categorias/'
        }).then((res) => setCategoria(res.data))
            .catch((err) => console.log(err))
    }
    //#endregion


    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.produto_nome.trim()) {
            let _product = { ...product };

            if (product.produto_id) {
                editarProduto(_product, product.produto_id)
            } else {
                criarProduto(_product)
            }
            setProductDialog(false);
        }
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {

        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        apagarProduto(product.produto_id)
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        selectedProducts.map((e) => {
            apagarProduto(e.produto_id)
        })
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
    };

    const onCategoryChange = (e) => {
        let _product = { ...product };

        _product['categoria_id'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, produto_nome) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${produto_nome}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, produto_nome) => {
        const val = e.value || 0;
        let _product = { ...product };

        _product[`${produto_nome}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="btn-topo">
                <Button label="NOVO" icon="pi pi-plus" style={{backgroundColor:'#6ABD6E', color:'white'}} onClick={openNew} />
                <Button label="APAGAR" icon="pi pi-trash" style={{backgroundColor:'red', color:'white'}} onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" style={{backgroundColor:'purple', color:'white'}} onClick={exportCSV} />;
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.preco_venda);
    };

    // const ratingBodyTemplate = (rowData) => {
    //     return <Rating value={rowData.rating} readOnly cancel={false} />;
    // };

    // const statusBodyTemplate = (rowData) => {
    //     return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>;
    // };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button icon="pi pi-pencil" style={{ color: 'green' }} rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
                </div>
            </React.Fragment>
        );
    };

    // const getSeverity = (product) => {
    //     switch (product.inventoryStatus) {
    //         case 'INSTOCK':
    //             return 'success';

    //         case 'LOWSTOCK':
    //             return 'warning';

    //         case 'OUTOFSTOCK':
    //             return 'danger';

    //         default:
    //             return null;
    //     }
    // };

    const header = (
        <div className="topo">
            <h4 className="m-0">Gerenciador de Produtos</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar Produto..." />
            </span>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable className='tableMain' ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="produto_id" paginator rows={5} rowsPerPageOptions={[5, 10]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} produtos" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="produto_id" header="Cod" sortable style={{ minWidth: '10%', textAlign: 'center' }}></Column>
                    <Column field="produto_nome" header="Nome do Produto" sortable style={{ minWidth: '20%' }}></Column>
                    <Column field="img64" header="Imagem" body={imageBodyTemplate} style={{ minWidth: '10%', textAlign: 'center' }}></Column>
                    <Column field="preco_venda" header="Preco de Venda" body={priceBodyTemplate} sortable style={{ minWidth: '10%', textAlign: 'center' }}></Column>
                    <Column field="categoria_id" header="Categoria" sortable style={{ minWidth: '10%', textAlign: 'center' }}></Column>
                    <Column field="quantidade" header="Estoque" sortable style={{ minWidth: '10%', textAlign: 'center' }}></Column>
                    {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10%' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalhes do Produto" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div>
                    {/* <UploadCloud/> */}
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nome do Produto
                    </label>
                    <InputText id="name" value={product.produto_nome} onChange={(e) => onInputChange(e, 'produto_nome')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.produto_nome && <small className="p-error">Nome Obrigatório</small>}
                </div>

                <label>Categoria</label>
                <div className="categoria-cadastro">
                    {categoria ? categoria.map((c) => {
                        return (
                            <div key={c.categoria_id}>
                                <div >
                                    <RadioButton value={c.categoria_id} name="categoria" onChange={onCategoryChange} checked={product.categoria_id === c.categoria_id} />
                                    <label>{c.categoria_nome}</label>
                                </div>
                            </div>
                        )
                    }) : <span> 0 Categorias cadastradas ou sem retorno da api</span>}
                </div>

                <div className="formgrid grid">
                    <div className='detalhes-valores'>
                        <div className="field col">
                            <label htmlFor="Preço" className="font-bold">
                                Preço de Venda
                            </label>
                            <InputNumber id="Preco de Venda" value={product.preco_venda} onValueChange={(e) => onInputNumberChange(e, 'preco_venda')} mode="currency" currency="BRL" locale="pt-BR" />
                        </div>
                        <div className="field col">
                            <label htmlFor="Preço de Compra" className="font-bold">
                                Preço de Compra
                            </label>
                            <InputNumber id="Preco de Compra" value={product.preco_compra} onValueChange={(e) => onInputNumberChange(e, 'preco_compra')} mode="currency" currency="BRL" locale="pt-BR" />
                        </div>
                    </div>
                    <div className='detalhes-valores'>
                        <div className="field col">
                            <label htmlFor="Quantidade" className="font-bold">
                                Quantidade
                            </label>
                            <InputNumber id="Quantidade" value={product.quantidade} onValueChange={(e) => onInputNumberChange(e, 'quantidade')} />
                        </div>
                        <div className="field col">
                            <label htmlFor="Data de Vencimento" className="font-bold">
                                Data de Vencimento
                            </label>
                            <InputText id="Data de Vencimento" value={product.data_vencimento} onChange={(e) => onInputChange(e, 'data_vencimento')} />
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Você tem certeza que deseja apagar o produto <b>{product.produto_nome}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Você tem certeza que deseja apagar todos os produtos selecionados?</span>}
                </div>
            </Dialog>
        </div>
    );

}