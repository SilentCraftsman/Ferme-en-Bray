'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import styles from '../../styles/CartPage.module.scss';
import { IoMdArrowRoundBack } from 'react-icons/io';

const CustomerForm = ({ createPayment, setShowCustomerFormPage }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerAddress: '',
      pickupDay: '',
      pickupTime: '',
    },
  });

  const onSubmit = (data) => {
    createPayment(data);
  };

  return (
    <>
      <div>
        <form
          className={styles.actionContainer}
          onSubmit={handleSubmit(onSubmit)}
        >
          <button
            className={styles.backButton}
            onClick={() => setShowCustomerFormPage(false)}
            title={'Retour au panier'}
          >
            <IoMdArrowRoundBack />
          </button>
          <div className={styles.customerInfo}>
            <h3>Informations du client</h3>
            <div className={styles.firstInfo}>
              <div className={styles.firstInfoName}>
                <span>Nom et prénom :</span>
                <input
                  className={styles.nameInput}
                  {...register('customerName')}
                  required
                />
              </div>
              <div className={styles.firstInfoEmail}>
                <span>Email :</span>
                <input
                  className={styles.emailInput}
                  {...register('customerEmail', {
                    required: 'Email est requis',
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: 'Email non valide',
                    },
                  })}
                  required
                  title="Email non valide"
                  type="email"
                />
                {/*{errors.customerEmail && (*/}
                {/*  <p className={styles.errorMessage}>*/}
                {/*    {errors.customerEmail.message}*/}
                {/*  </p>*/}
                {/*)}*/}
              </div>
              <div className={styles.firstInfoAddress}>
                <span>Adresse :</span>
                <input
                  className={styles.addressInput}
                  {...register('customerAddress')}
                  required
                />
              </div>
            </div>
          </div>
          <div className={styles.datePickerContainer}>
            <h3 className={styles.dateTitle}>Jour et l'heure de retrait</h3>
            <div className={styles.dataSelectContainer}>
              <select
                className={styles.dateSelect}
                {...register('pickupDay')}
                required
              >
                <option value="">Sélectionnez un jour</option>
                <option value="vendredi">Vendredi</option>
                <option value="samedi">Samedi</option>
              </select>
              <select
                className={styles.dateSelect}
                {...register('pickupTime')}
                required
              >
                <option value="">Sélectionnez une heure</option>
                <option value="17:30">17:30</option>
                <option value="18:00">18:00</option>
                <option value="18:30">18:30</option>
                <option value="19:00">19:00</option>
                <option value="19:30">19:30</option>
                <option value="20:00">20:00</option>
              </select>
            </div>
            <button className={styles.checkoutButton} type="submit">
              Payer
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CustomerForm;
