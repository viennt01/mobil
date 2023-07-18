import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button} from 'antd';
import { postPayment, getDeliverablePayment } from './fetcher';
import { useParams } from 'react-router-dom';


const Payment = () => {
    const { application_id } = useParams();
    const [dataDeliverables, setDataDeliverables] = useState(null);



    useEffect(() =>{
        getDeliverablePayment(application_id)
            .then((payload) => {
                console.log(payload.deliverables.rows);
                setDataDeliverables(payload.deliverables.rows)
            })
            .catch((err) => {
                console.log("err", err);
            })
    }, [application_id]);

    const studentId = localStorage.getItem("student_id");
  const handlePayment = () => {
    const payload = {
        deliverables: dataDeliverables.map(item => ({
            deliverable_id: item.deliverable_id,
            title: item.title,
            deliverable_application: {
                application_id: item.deliverable_application.application_id,
                price: item.deliverable_application.price,
                student_id: studentId
            }
        }))
    };
    
    postPayment(payload)
        .then(response => {
            // handle successful response
            console.log("Payment success:", response);
            window.location.href = response.url;
        })
        .catch(error => {
            // handle error
            console.log("Payment error:", error);
        });
}

  return (
    <div className="cart-container">
      <h2>Payment Project</h2>
      {dataDeliverables === 0 ? (
        <div className="cart-empty">
          <p>No project?</p>
          <div className="start-shopping">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              <span>Back</span>
            </Link>
          </div>
        </div>
          ) : (
        <div >
        { dataDeliverables && dataDeliverables.map((item) => (
          <div className="titles" key={item.deliverable_id}>Tittle: {item.title}
            <h4 className="product-title">Description: {item.description}</h4>
            <h3 className="price">Price: {item.deliverable_application.price} vnd</h3>
            <div className="item_img" style={{ paddingRight: '150px' }}>
                <img src={item.deliverable_application.application_project.image} alt="project" style={{ maxWidth: '100%', maxHeight: '300px' }} />
            </div>
            <div className="buttons-container" style={{justifyContent: 'space-between', display: 'flex'}}>
            <Button  href={item.file}>Dowload file here</Button>
            <Button onClick={handlePayment}>Payment Now</Button>
          </div>
          </div>
            ))}
        </div>
        
        )}
    </div>
  );
};

export default Payment;
