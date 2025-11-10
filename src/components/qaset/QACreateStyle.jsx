import Typography from '@components/common/Typography';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import styled from 'styled-components';

// --- 페이지 스타일 정의 ---
export const MainContentWrapper = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
  min-height: 80vh;
`;

export const QaCreateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[6]};
  padding-bottom: ${({ theme }) => theme.space[4]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[12]};
`;

export const SettingsBox = styled.div`
  width: 90%;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.gray[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[8]};
  margin-top: ${({ theme }) => theme.space[8]};
  box-shadow: ${({ theme }) => theme.shadow.sm};

  & > * {
    margin-bottom: ${({ theme }) => theme.space[6]};
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const FormWrapper = styled.div`
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
`;

export const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

export const SectionTitle = styled(Typography).attrs({ as: 'h2', size: 5, weight: 'bold' })`
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

export const RequiredAsterisk = styled.span`
  color: ${({ theme }) => theme.colors.primary[9]};
  font-size: ${({ theme }) => theme.font.size[5]};
  margin-left: 4px;
`;

export const OptionalText = styled.span`
  font-size: ${({ theme }) => theme.font.size[2]};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  color: ${({ theme }) => theme.colors.gray[9]};
  margin-left: 8px;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.font.size[3]};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[7]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary[7]};
  }
`;

export const FormTextAreaSummary = styled(FormInput).attrs({ as: 'textarea' })`
  min-height: auto;
  resize: none;
`;

export const QASetListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

export const AddSetButton = styled.button`
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  margin: ${({ theme }) => theme.space[6]} auto 0;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary[9]};
  cursor: pointer;
  color: white;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[10]};
  }
`;

export const CheckboxRoot = styled(CheckboxPrimitive.Root)`
  all: unset;
  background-color: white;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[3]};
  }
  &[data-state='checked'] {
    background-color: ${({ theme }) => theme.colors.primary[9]};
    border-color: ${({ theme }) => theme.colors.primary[9]};
  }
  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[6]};
  }
`;

export const CheckboxIndicator = styled(CheckboxPrimitive.Indicator)`
  color: white;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.font.size[3]};
  color: ${({ theme }) => theme.colors.gray[11]};
  cursor: pointer;
  user-select: none;
`;

export const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[8]};
`;

export const SubmitButton = styled.button`
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[5]};
  background-color: ${({ theme }) => theme.colors.primary[9]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.font.size[3]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[10]};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[5]};
    cursor: not-allowed;
  }
`;

export const Divider = styled.hr`
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[5]};
  margin: ${({ theme }) => theme.space[10]} 0;
`;

export const OverlayWrapper = styled.div`
  transform: none !important;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadow.md};
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  min-width: 260px;
  max-width: 560px;
  box-sizing: border-box;
  pointer-events: none;
`;

export const OverlayBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.font.size[1]};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.primary[11]};
  background-color: ${({ theme }) => theme.colors.primary[2]};
  width: fit-content;
`;

export const OverlayQuestion = styled.div`
  font-size: ${({ theme }) => theme.font.size[3]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.colors.gray[12]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const QaUpdateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[6]};
  padding-bottom: ${({ theme }) => theme.space[4]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[12]};
`;
