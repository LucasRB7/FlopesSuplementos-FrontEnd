
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import 'primeicons/primeicons.css';
import axios from 'axios';


import './style.css'
//import UploadCloud from '../UploadCloudnary/UploadCloud';

export default function Clientes() {
    let emptyClient = {
        id: null,
        nome_pessoa: '',
        apelido: '',
        endereco: '',
        telefone: '',
        email: '',
        rg_cpf: '',
        data_nasc: '',

    };

    const [clientes, setclientes] = useState([{ ...emptyClient }]);
    const [ClienteDialog, setClienteDialog] = useState(false);
    const [deleteClienteDialog, setDeleteClienteDialog] = useState(false);
    const [deleteclientesDialog, setDeleteclientesDialog] = useState(false);
    const [cliente, setcliente] = useState(emptyClient);
    const [selectedclientes, setSelectedclientes] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    //const [uploadedImage, setUploadedImage] = useState(null);

    useEffect(() => {
        buscarClient();
    }, []);

    //#region Produtos
    const buscarClient = () => {
        axios({
            method: 'get',
            url: 'http://localhost:3000/cliente/'
        }).then((res) => setclientes(res.data))
            .catch((err) => {
                if (err.code == "ERR_NETWORK") {
                    toast.current.show({ severity: 'error', summary: 'Erro nos clientes: API FORA!', life: 8000 });
                }
            })
    }
    const criarCliente = (prod) => {
        axios({
            method: 'post',
            url: 'http://localhost:3000/cliente/cadastrar',
            data: prod
        }).then(() => {
            toast.current.show({ severity: 'success', summary: 'Cliente salvo com sucesso!' });
            buscarClient()
        })
            .catch((err) => {
                if (err.code == "ERR_NETWORK") {
                    toast.current.show({ severity: 'error', summary: 'Erro ao salvar o cliente! Possivel problema: API FORA', life: 8000 });
                }
            })
    }
    const editarCliente = (prod, id) => {
        axios({
            method: 'patch',
            url: `http://localhost:3000/cliente/update/${id}`,
            data: prod
        }).then(() => {
            buscarClient()
            toast.current.show({ severity: 'success', summary: 'Produto atualizado com sucesso!', life: 3000 });
        })
            .catch((err) => {
                if (err.code == "ERR_NETWORK") {
                    toast.current.show({ severity: 'error', summary: 'Erro ao editar o cliente! Possivel problema: API FORA', life: 8000 });
                }
            })
    }
    const apagarCliente = (id) => {
        axios({
            method: 'delete',
            url: `http://localhost:3000/cliente/delete/${id}`
        }).then(() => {
            buscarClient()
            toast.current.show({ severity: 'success', summary: 'Cliente apagado com sucesso!', life: 3000 });
        }).catch((err) => {
            console.log(err)
            if (err.code == 'ERR_NETWORK') {
                toast.current.show({ severity: 'error', summary: 'Erro ao apagar o cliente! Possivel problema: API FORA', life: 8000 });
            } else if (err.code == 'ERR_BAD_RESPONSE') {
                toast.current.show({ severity: 'error', summary: 'Erro ao apagar o cliente! Possivel problema: Cliente associado a uma venda', life: 8000 });
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
    
    //#endregion


    const openNew = () => {
        setcliente(emptyClient);
        setSubmitted(false);
        setClienteDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setClienteDialog(false);
    };

    const hideDeleteClienteDialog = () => {
        setDeleteClienteDialog(false);
    };

    const hideDeleteclientesDialog = () => {
        setDeleteclientesDialog(false);
    };

    const savecliente = () => {
        setSubmitted(true);

        if (cliente.nome_pessoa.trim()) {
            let _cliente = { ...cliente };

            if (cliente.id) {
                editarCliente(_cliente, cliente.id)
            } else {
                criarCliente(_cliente)
            }
            setClienteDialog(false);
        }
    };

    const editcliente = (cliente) => {
        setcliente({ ...cliente });
        setClienteDialog(true);
    };

    const confirmDeletecliente = (cliente) => {
        setcliente(cliente);
        setDeleteClienteDialog(true);
    };

    const deletecliente = () => {

        setDeleteClienteDialog(false);
        setcliente(emptyClient);
        apagarCliente(cliente.id)
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteclientesDialog(true);
    };

    const deleteSelectedclientes = () => {
        selectedclientes.map((e) => {
            apagarCliente(e.id)
        })
        setDeleteclientesDialog(false);
        setSelectedclientes(null);
    };

   
    const onInputChange = (e, nome_pessoa) => {
        const val = (e.target && e.target.value) || '';
        let _cliente = { ...cliente };

        _cliente[`${nome_pessoa}`] = val;

        setcliente(_cliente);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="btn-topo">
                <Button label="NOVO" icon="pi pi-plus" style={{backgroundColor:'#6ABD6E', color:'white'}} onClick={openNew} />
                <Button label="APAGAR" icon="pi pi-trash" style={{backgroundColor:'red', color:'white'}} onClick={confirmDeleteSelected} disabled={!selectedclientes || !selectedclientes.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" style={{backgroundColor:'purple', color:'white'}} onClick={exportCSV} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button icon="pi pi-pencil" style={{ color: 'green' }} rounded outlined className="mr-2" onClick={() => editcliente(rowData)} />
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeletecliente(rowData)} />
                </div>
            </React.Fragment>
        );
    };

    const header = (
        <div className="topo">
            <h4 className="m-0">Gerenciador de Clientes</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar Cliente..." />
            </span>
        </div>
    );
    const ClienteDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" onClick={savecliente} />
        </React.Fragment>
    );
    const deleteClienteDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideDeleteClienteDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deletecliente} />
        </React.Fragment>
    );
    const deleteclientesDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideDeleteclientesDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deleteSelectedclientes} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable className='tableMain' ref={dt} value={clientes} selection={selectedclientes} onSelectionChange={(e) => setSelectedclientes(e.value)}
                    dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} clientes" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="id" header="Cod" sortable style={{ minWidth: '5%', textAlign: 'center' }}></Column>
                    <Column field="nome_pessoa" header="Nome do Produto" sortable style={{ minWidth: '20%' }}></Column>
                    <Column field="apelido" header="Apelido" sortable style={{ minWidth: '20%' }}></Column>
                    <Column field="telefone" header="Telefone" sortable style={{ minWidth: '20%' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '5%' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={ClienteDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Informações do Cliente" modal className="p-fluid" footer={ClienteDialogFooter} onHide={hideDialog}>
                <div>
                    {/* <UploadCloud/> */}
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nome do Cliente
                    </label>
                    <InputText id="name" value={cliente.nome_pessoa} onChange={(e) => onInputChange(e, 'nome_pessoa')} required autoFocus className={classNames({ 'p-invalid': submitted && !cliente.nome_pessoa })} />
                    {submitted && !cliente.nome_pessoa && <small className="p-error">Nome Obrigatório</small>}
                </div>               

                <div className="formgrid grid">
                    <div className='detalhes-valores'>
                        <div className="field col">
                            <label htmlFor="apelido" className="font-bold">
                                Apelido
                            </label>
                            <InputText id="apelido" value={cliente.apelido} onChange={(e) => onInputChange(e, 'apelido')}/>
                        </div>
                        <div className="field col">
                            <label htmlFor="endereco" className="font-bold">
                                Endereço
                            </label>
                            <InputText id="endereco" value={cliente.endereco} onChange={(e) => onInputChange(e, 'endereco')}/>
                        </div>
                    </div>
                    <div className='detalhes-valores'>
                        <div className="field col">
                            <label htmlFor="telefone" className="font-bold">
                                Telefone
                            </label>
                            <InputText id="telefone" value={cliente.telefone} onChange={(e) => onInputChange(e, 'telefone')}/>
                        </div>
                        <div className="field col">
                            <label htmlFor="email" className="font-bold">
                                Email
                            </label>
                            <InputText id="enail" value={cliente.email} onChange={(e) => onInputChange(e, 'email')}/>
                        </div>
                    </div>
                    <div className='detalhes-valores'>
                        <div className="field col">
                            <label htmlFor="rg_cpf" className="font-bold">
                                RG/CPF
                            </label>
                            <InputText id="rg_cpf" value={cliente.rg_cpf} onChange={(e) => onInputChange(e, 'rg_cpf')}/>
                        </div>
                        <div className="field col">
                            <label htmlFor="data_nasc" className="font-bold">
                                Data de Nascimento
                            </label>
                            <InputText id="data_nasc" value={cliente.data_nasc} onChange={(e) => onInputChange(e, 'data_nasc')}/>
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteClienteDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteClienteDialogFooter} onHide={hideDeleteClienteDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {cliente && (
                        <span>
                            Você tem certeza que deseja apagar o cliente <b>{cliente.nome_pessoa}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteclientesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteclientesDialogFooter} onHide={hideDeleteclientesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {cliente && <span>Você tem certeza que deseja apagar todos os clientes selecionados?</span>}
                </div>
            </Dialog>
        </div>
    );

}