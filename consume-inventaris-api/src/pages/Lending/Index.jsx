import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Case from "../../components/Case";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";

export default function Lending() {
    const [lending, setLending] = useState([]);
    const [error, setError] = useState({});
    const [authUser, setAuthUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login?message=' + encodeURIComponent('Anda belum login'));
            return;
        }

        axios.get('http://localhost:8000/profile', {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        })
        .then(res => {
            setAuthUser(res.data.data);
        })
        .catch(err => {
            if (err.response && err.response.status === 401) {
                navigate('/login?message=' + encodeURIComponent('Anda belum login'));
            }
        });

        axios.get('http://localhost:8000/lendings', {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        })
        .then(res => {
            setLending(res.data.data);
        })
        .catch(err => {
            setError({ message: 'Terjadi kesalahan saat memuat daftar barang.' });
        });
    }, [navigate]);

    const deleteLending = (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin ingin menghapus barang ini?',
            text: 'Tindakan ini tidak dapat dikembalikan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('access_token');
                axios.delete(`http://localhost:8000/lendings/delete/${id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    }
                })
                .then(() => {
                    setLending(prevLending => prevLending.filter(item => item.id !== id));
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Barang berhasil dihapus.',
                        icon: 'success',
                        timer: 1500,
                        timerProgressBar: true,
                        showConfirmButton: false
                    });
                })
                .catch(err => {
                    setError({ message: 'Gagal menghapus barang.' });
                });
            }
        });
    };

    return (
        <Case>
            <div className="block w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="m-5 pb-10 pt-10">
                    <div className="flex justify-between items-center">
                        <h5 className="mb-1 ml-5 text-3xl font-medium text-gray-900 dark:text-white">Lending</h5>
                        {authUser && authUser.role === 'Staff' && (
                            <div className="flex space-x-2">
                                <button className="px-4 py-2 bg-teal-700 text-white shadow-md border-sky-500 rounded-lg">
                                    <Link to="/lending/create">
                                        <small className="text-white">Tambah</small>
                                    </Link>
                                    <FontAwesomeIcon icon="fa-solid fa-plus" className="pl-1 w-4 h-4 text-inherit" />
                                </button>
                                <button className="px-4 py-2 bg-orange-700 text-white shadow-md border-sky-500 rounded-lg">
                                    <Link to="/lending/trash">
                                        <small className="text-white">Restore</small>
                                    </Link>
                                </button>
                            </div>
                        )}
                    </div>

                    {error.message && (
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

                    <div className="flex mt-4 md:mt-6">
                        <table className="min-w-full text-left text-sm font-light">
                            <thead className="border-b font-medium dark:border-neutral-500 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-4">No</th>
                                    <th scope="col" className="px-6 py-4">Name</th>
                                    <th scope="col" className="px-6 py-4">Date_Time</th>
                                    <th scope="col" className="px-6 py-4">Stuff_id</th>
                                    <th scope="col" className="px-6 py-4">User_id</th>
                                    <th scope="col" className="px-6 py-4">Notes</th>
                                    <th scope="col" className="px-6 py-4">Total Stuff</th>
                                    {authUser && authUser.role === 'Staff' && (
                                        <th scope="col" className="px-6 py-4">Action</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {lending.map((lending, index) => (
                                    <tr key={lending.id} className="border-b dark:border-neutral-500">
                                        <td className="text-white px-6 py-4">{index + 1}</td>
                                        <td className="text-white px-6 py-4">{lending.name}</td>
                                        <td className="text-white px-6 py-4">{lending.date_time}</td>
                                        <td className="text-white px-6 py-4">{lending.stuff_id}</td>
                                        <td className="text-white px-6 py-4">{lending.user_id}</td>
                                        <td className="text-white px-6 py-4">{lending.notes}</td>
                                        <td className="text-white px-6 py-4">{lending.total_stuff}</td>
                                        {authUser && authUser.role === 'Staff' && (
                                            <td className="text-white px-6 py-4">
                                                <button onClick={() => deleteLending(lending.id)} type="button" className="px-4 py-2 bg-red-500 rounded-lg font-bold text-white">Hapus</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Case>
    );
}
