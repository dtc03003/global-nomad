import Button from '@/components/Button/Button';
import styles from './ActivityPostForm.module.scss';
import classNames from 'classnames/bind';
import { Input } from '@/components/Input/Input';
import { Dropdown, DropdownRef } from '@/components/Dropdown/Dropdown';
import Textarea from '@/components/Textarea/Textarea';
import { DateInput, DateInputRef } from '@/components/DateInput/DateInput';
import AddImageBtn from '@/components/btns/AddImageBtn/AddImageBtn';
import ControlTimeBtn from '@/components/btns/ControlTimeBtn/ControlTimeBtn';
import LongStroke from '@/images/icon/icon_stroke_long.svg';
import Stroke from '@/images/icon/icon_stroke.svg';
import { useState, useRef, CSSProperties } from 'react';
import DeleteBtn from '@/components/btns/DeleteBtn/DeleteBtn';
import { useMediaQuery } from 'react-responsive';

export default function ActivityPostForm() {
  const cn = classNames.bind(styles);
  const menuItems = [
    '0:00',
    '1:00',
    '2:00',
    '3:00',
    '4:00',
    '5:00',
    '6:00',
    '7:00',
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];

  const inputStyle: CSSProperties = {
    color: '#1b1b1b',
  };

  const deleteBtnStyle: CSSProperties = {
    position: 'absolute',
    top: '-1rem',
    right: '-1rem',
    zIndex: 1,
  };

  const isPc = useMediaQuery({ query: '(min-width: 767px' });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Array<{ date: Date; startTime: string; endTime: string }>>([]);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);
  const [introImageUrls, setIntroImageUrls] = useState<string[]>([]);

  const dateInputRef = useRef<DateInputRef>(null);
  const startTimeDropdownRef = useRef<DropdownRef>(null);
  const endTimeDropdownRef = useRef<DropdownRef>(null);

  const handleBannerImageSelect = (imageUrl: string) => {
    setBannerImageUrl(imageUrl);
  };

  const handleIntroImageSelect = (imageUrl: string) => {
    if (introImageUrls.length < 4) {
      setIntroImageUrls([...introImageUrls, imageUrl]);
    }
  };

  const handleControlTimeClick = () => {
    if (selectedDate && startTime && endTime) {
      const isDuplicate = selectedItems.some((item) => {
        return (
          formatDate(item.date) === formatDate(selectedDate) && item.startTime === startTime && item.endTime === endTime
        );
      });

      if (!isDuplicate) {
        setSelectedItems([...selectedItems, { date: selectedDate, startTime, endTime }]);
        if (dateInputRef.current) dateInputRef.current.reset();
        if (startTimeDropdownRef.current) startTimeDropdownRef.current.reset();
        if (endTimeDropdownRef.current) endTimeDropdownRef.current.reset();
      } else {
        alert('이미 선택된 시간대입니다.');
      }
    }
  };

  const handleDeleteItemClick = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleDeleteBannerImageClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setBannerImageUrl(null);
  };

  const handleDeleteIntroImageClick = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    setIntroImageUrls(introImageUrls.filter((_, i) => i !== index));
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return (
    <form>
      <div className={cn('titleBox')}>
        <h1>내 체험 등록</h1>
        <Button type="primary" size="medium" htmlType="button">
          등록하기
        </Button>
      </div>
      <div className={cn('formContainer')}>
        <Input type="text" placeholder="제목" sx={inputStyle} />
        <Dropdown isLabelVisible={false} />
        <Textarea placeholder="설명" />
        <div className={cn('inputContainer')}>
          <label className={cn('label')}>가격</label>
          <Input type="text" placeholder="가격" sx={inputStyle} />
        </div>
        <div className={cn('inputContainer')}>
          <label className={cn('label')}>주소</label>
          <Input type="text" placeholder="주소" sx={inputStyle} />
        </div>
        <label className={cn('label')}>예약 가능한 시간대</label>
        <div className={cn('reservationTimeWrapper')}>
          <div className={cn('reservationDateBox', 'commonWidth')}>
            <label className={cn('smallLabel')}>날짜</label>
            <DateInput dateText="YY/MM/DD" onChange={(date: Date) => setSelectedDate(date)} ref={dateInputRef} />
          </div>
          <div className={cn('reservationTimeContainer')}>
            <div className={cn('reservationTimeBox')}>
              <label className={cn('smallLabel')}>시작 시간</label>
              <Dropdown
                className={cn('dropdown')}
                isLabelVisible={false}
                menuItems={menuItems}
                onChange={(value: string) => setStartTime(value)}
                ref={startTimeDropdownRef}
              />
            </div>
            {isPc && <p className={cn('wave')}>~</p>}
            <div className={cn('reservationTimeBox')}>
              <label className={cn('smallLabel')}>종료 시간</label>
              <Dropdown
                className={cn('dropdown')}
                isLabelVisible={false}
                menuItems={menuItems}
                onChange={(value: string) => setEndTime(value)}
                ref={endTimeDropdownRef}
              />
            </div>
          </div>
          <div className={cn('controlTimeBtnContainer')}>
            <ControlTimeBtn type="plus" onClick={handleControlTimeClick} />
          </div>
        </div>
        {selectedItems.length > 0 && (
          <>
            <div className={cn('selectedItems')}>
              {isPc ? <LongStroke /> : <Stroke />}
              {selectedItems.map((item, index) => (
                <div key={index} className={cn('selectedItem')}>
                  <div className={cn('reservationDateBox')}>
                    <Input
                      className={cn('dateInputBox', 'commonWidth')}
                      type="text"
                      readOnly={true}
                      placeholder={formatDate(item.date)}
                      sx={inputStyle}
                    />
                  </div>
                  <div className={cn('reservationTimeContainer')}>
                    <div className={cn('reservationTimeBox')}>
                      <Input
                        className={cn('timeInputBox')}
                        type="text"
                        readOnly={true}
                        placeholder={item.startTime}
                        sx={inputStyle}
                      />
                    </div>
                    {isPc && <p>~</p>}
                    <div className={cn('reservationTimeBox')}>
                      <Input
                        className={cn('timeInputBox')}
                        type="text"
                        readOnly={true}
                        placeholder={item.endTime}
                        sx={inputStyle}
                      />
                    </div>
                  </div>
                  <ControlTimeBtn type="minus" onClick={() => handleDeleteItemClick(index)} />
                </div>
              ))}
            </div>
          </>
        )}
        <div className={cn('imageContainer')}>
          <label className={cn('label')}>배너 이미지</label>
          <div className={cn('bannerImagePreviewContainer')}>
            <AddImageBtn onImageSelect={handleBannerImageSelect} />
            {bannerImageUrl && (
              <div className={cn('imagePreviewBox')}>
                <DeleteBtn sx={deleteBtnStyle} onClick={(event) => handleDeleteBannerImageClick(event)} />
                <img className={cn('imagePreview')} src={bannerImageUrl} alt="배너 이미지 미리보기" />
              </div>
            )}
          </div>
        </div>
        <div className={cn('imageContainer')}>
          <label className={cn('label')}>소개 이미지</label>
          <div className={cn('introImagePreviewContainer')}>
            <AddImageBtn onImageSelect={handleIntroImageSelect} />
            {introImageUrls.map((imageUrl, index) => (
              <div className={cn('imagePreviewBox')}>
                <DeleteBtn sx={deleteBtnStyle} onClick={(event) => handleDeleteIntroImageClick(event, index)} />
                <img
                  key={index}
                  className={cn('imagePreview')}
                  src={imageUrl}
                  alt={`소개 이미지 ${index + 1} 미리보기`}
                />
              </div>
            ))}
          </div>
          <p className={cn('description')}>*이미지를 최소 4개 이상 제출해주세요.</p>
        </div>
      </div>
    </form>
  );
}