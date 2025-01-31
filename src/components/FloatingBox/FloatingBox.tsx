import { useState } from 'react';
import classNames from 'classnames/bind';
import Button from '@/components/Button/Button';
import Stroke from '@/images/icon/icon_stroke.svg';

import DateInfo from './DateInfo';
import HeadCountInfo from './HeadCountInfo';
import PriceInfo from './PriceInfo';
import { priceDataForm } from './priceDataForm';
import styles from './FloatingBox.module.scss';
import { useBookReservations, useGetAvailableSchedule } from '@/apis/apiHooks/temporary';
import { AvailableScheduleType, Time } from '@/types/activities.types';
import { AxiosError } from 'axios';
import saveActivityToFirebase from '@/firebase/saveActivityToFirebase';
import useGetCookie from '@/hooks/useCookies';
import { COOKIE } from '@/constants';

const cn = classNames.bind(styles);

interface activityData {
  id: number;
  userId: number;
  title: string;
  createdAt: string;
}

interface FloatingBoxProps {
  activityData: activityData;
  price: number;
  activityId: string;
}

function getObjMappedDateAndTimes(datas: AvailableScheduleType) {
  let results = {};
  datas.forEach((data) => {
    results = {
      ...results,
      [data.date]: data.times,
    };
  });

  return results;
}

export default function FloatingBox({ activityData, price, activityId }: FloatingBoxProps) {
  const [count, setCount] = useState(1);
  const [datepick, setDatepick] = useState(new Date());
  const [scheduleId, setScheduleId] = useState(-1);
  const { mutateAsync: reservationMutateFn, error, status } = useBookReservations({ activityId });
  const { data } = useGetAvailableSchedule({
    activityId,
    year: String(datepick.getFullYear()),
    month: String(datepick.getMonth() + 1 < 10 ? `0${datepick.getMonth() + 1}` : `${datepick.getMonth() + 1}`),
  });

  const obj_mapped_date_times = (data && getObjMappedDateAndTimes(data)) as { [key: string]: Time[] };

  const { getCookie } = useGetCookie();
  const userId = Number(getCookie(COOKIE.USER_ID));

  const handleReservationClick = async ({ scheduleId, headCount }: { scheduleId: number; headCount: number }) => {
    if (scheduleId < 0) {
      alert('시간대를 선택해주세요');
      return;
    }

    try {
      const result = await reservationMutateFn({ scheduleId, headCount });
      const reservationId = result.reservationId;
      saveActivityToFirebase(activityData, obj_mapped_date_times, scheduleId, reservationId, userId);
    } catch (error) {
      console.error('Error during reservation:', error);
    }
  };

  if (status === 'error') {
    if ((error as AxiosError).response?.status === 401) alert('로그인을 해주세요.');
    if ((error as AxiosError).response?.status === 409) alert('이미 예약한 일정입니다.');
  }

  if (status === 'success') {
    alert('신청을 완료하였습니다.');
  }

  return (
    <div className={cn('container')}>
      <div className={cn('price')}>
        {priceDataForm(price, 1)}
        <span className={cn('per')}>/ 인</span>
      </div>
      <Stroke width="100%" className={cn('stroke')} />
      <DateInfo
        datepick={datepick}
        onChangeDatepick={(date: Date) => {
          setDatepick(date);
        }}
        availableDates={data?.map((item) => item.date.split('-')[2]) as string[]}
        obj_mapped_date_times={obj_mapped_date_times}
        onChangeScheduleId={(scheduleId: number) => setScheduleId(scheduleId)}
        scheduleId={scheduleId}
      />
      <HeadCountInfo count={count} setCount={setCount} />
      <Button
        type="primary"
        size="large"
        className={cn('reservationBtn')}
        onClick={() => handleReservationClick({ scheduleId, headCount: count })}
      >
        예약하기
      </Button>
      <Stroke width="100%" className={cn('stroke')} />
      <PriceInfo price={price} count={count} />
    </div>
  );
}
