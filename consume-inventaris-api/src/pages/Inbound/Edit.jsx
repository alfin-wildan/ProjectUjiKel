import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Case from "../../components/Case";

export default function InboundEdit() {
    const { id } = useParams();
    const [forms, setForms] = useState({
        stuff_id: '',
        total: '',
        date: '',
        proff_file: ''
    });
    const [error, setError] = useState([]);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const instance = axios.create({
        baseURL: 'http://localhost:8000/',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });

    useEffect(() => {
        instance.get(`InboundStuff/${id}`)
            .then(res => {
                setForms(res.data.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setForms(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (event) => {
        setForms(prevState => ({
            ...prevState,
            proff_file: event.target.files[0]
        }));
    };

    const handleUpdateInbound = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('stuff_id', forms.stuff_id);
        formData.append('total', forms.total);
        formData.append('date', forms.date);
        if (forms.proff_file) {
            formData.append('proff_file', forms.proff_file);
        }

        instance.patch(`InboundStuff/edit/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                setError([]);
                setSuccess(true);
                setTimeout(() => {
                    navigate('/InboundStuff');
                }, 2000);
            })
            .catch(err => {
                setError({ message: 'Terjadi kesalahan saat mengupdate barang. Silakan coba lagi.' });
            });
    };

    return (
        <Case>
            <div className="block m-auto h-screen bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="items-center m-5 pb-10 pt-10">
                    {success && (
                        <div role="alert">
                            <div className="bg-green-500 text-white font-bold rounded-t px-4 py-2">
                                Berhasil!
                            </div>
                            <div className="border border-t-0 border-green-400 rounded-b bg-green-100 px-4 py-3 text-green-700">
                                Barang berhasil diupdate.
                            </div>
                        </div>
                    )}

                    {error && Object.keys(error).length > 0 && (
                        <div role="alert">
                            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                                Gagal!
                            </div>
                            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                                <ul>
                                    <li>{error.message}</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="text-center mb-6">
                        <h5 className="text-3xl font-medium text-gray-900 dark:text-white">Edit Inbound</h5>
                    </div>
                    <form onSubmit={handleUpdateInbound}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label htmlFor="stuff_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stuff ID</label>
                                <input type="text" id="stuff_id" name="stuff_id" value={forms.stuff_id} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ketik Id" required onChange={handleInputChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="total" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                                <input type="text" id="total" name="total" value={forms.total} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ketik Total" required onChange={handleInputChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                                <input type="datetime-local" id="date" name="date" value={forms.date} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ketik Password" required onChange={handleInputChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="proff_file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">File</label>
                                <input type="file" id="proff_file" name="proff_file" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ketik Role" onChange={handleFileChange} />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </Case>
    );
}